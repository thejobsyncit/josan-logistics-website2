import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const GENERIC_NOT_FOUND_MSG = "Tracking number not found or unavailable.";

// Helper: HMAC-SHA-256 for privacy-preserving IP rate limiting using server secret
async function hmacSha256(keyStr: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keyStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  // 1. Origin check: ALLOWED_ORIGIN is required and fails closed
  const allowedOriginEnv = (Deno.env.get("ALLOWED_ORIGIN") || "").trim();
  if (!allowedOriginEnv) {
    console.error("[track-shipment] Server configuration error: ALLOWED_ORIGIN not set");
    return new Response(
      JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Validate Origin against comma-separated list (no '*' fallback)
  const allowedList = allowedOriginEnv.split(",").map((o) => o.trim()).filter(Boolean);
  const requestOrigin = (req.headers.get("origin") || "").trim();

  // Reject if Origin not in list: HTTP 403 and NO Access-Control-Allow-Origin header
  if (!requestOrigin || !allowedList.includes(requestOrigin)) {
    return new Response(
      JSON.stringify({ error: "Forbidden" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": requestOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Expose-Headers": "Retry-After",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      console.warn("[track-shipment] Invalid JSON payload received");
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Validate tracking number: trimmed, 6 to 40 characters, letters, digits and hyphens only
    const rawTrackingNumber = String(body.tracking_number || body.trackingNumber || "").trim();
    if (!/^[A-Za-z0-9\-]{6,40}$/.test(rawTrackingNumber)) {
      console.warn("[track-shipment] Invalid tracking number format");
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const trackingNumber = rawTrackingNumber.toUpperCase();

    // 4. Verify Cloudflare Turnstile token server-side with TURNSTILE_SECRET_KEY
    const turnstileToken = String(body.turnstile_token || body.token || "").trim();
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";

    if (!turnstileSecret) {
      console.error("[track-shipment] Server configuration error: TURNSTILE_SECRET_KEY not set");
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!turnstileToken) {
      console.warn("[track-shipment] Missing Turnstile verification token");
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Client IP priority: cf-connecting-ip first, then first comma-separated value of x-forwarded-for
    let clientIp = "";
    const cfHeader = req.headers.get("cf-connecting-ip");
    if (cfHeader && cfHeader.trim()) {
      clientIp = cfHeader.trim();
    } else {
      const xForwardedFor = req.headers.get("x-forwarded-for");
      if (xForwardedFor && xForwardedFor.trim()) {
        clientIp = xForwardedFor.split(",")[0].trim();
      } else {
        clientIp = "127.0.0.1";
      }
    }

    const verifyFormData = new FormData();
    verifyFormData.append("secret", turnstileSecret);
    verifyFormData.append("response", turnstileToken);
    if (clientIp) {
      verifyFormData.append("remoteip", clientIp);
    }

    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verifyFormData,
    });
    const turnstileResult = await turnstileRes.json().catch(() => ({ success: false }));

    if (!turnstileResult.success) {
      const rawCodes = Array.isArray(turnstileResult["error-codes"]) ? turnstileResult["error-codes"] : [];
      const codes = rawCodes
        .filter((c: unknown): c is string => typeof c === "string" && c.length <= 40)
        .slice(0, 5);
      console.warn("[track-shipment] Turnstile failed:", codes.join(","));
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Initialize Supabase Admin client with service_role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[track-shipment] Server configuration error: Supabase service key missing");
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 6. Rate Limit check: HMAC-SHA-256 of IP with RATE_LIMIT_SALT (fail closed if missing)
    const rateLimitSalt = (Deno.env.get("RATE_LIMIT_SALT") || "").trim();
    if (!rateLimitSalt) {
      console.error("[track-shipment] Server configuration error: RATE_LIMIT_SALT not set");
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ipHash = await hmacSha256(rateLimitSalt, clientIp);

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // Cleanup rows older than 24 hours on a small fraction of requests (~1 in 20 = 5%)
    if (Math.random() < 0.05) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { error: cleanupErr } = await supabaseAdmin
        .from("tracking_rate_limit")
        .delete()
        .lt("created_at", twentyFourHoursAgo);
      if (cleanupErr) {
        console.warn("[track-shipment] Cleanup older records notice");
      }
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count: lookupCount, error: countErr } = await supabaseAdmin
      .from("tracking_rate_limit")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);

    if (countErr) {
      console.warn("[track-shipment] Rate limit check failed");
      return new Response(
        JSON.stringify({ error: "Tracking is temporarily unavailable.", data: null }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (lookupCount !== null && lookupCount >= 20) {
      console.warn("[track-shipment] Rate limit exceeded");
      return new Response(
        JSON.stringify({ error: "Too many lookups. Please try again later.", data: null }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": "3600"
          }
        }
      );
    }

    // Record this lookup attempt in tracking_rate_limit table
    const { error: logErr } = await supabaseAdmin
      .from("tracking_rate_limit")
      .insert({ ip_hash: ipHash });

    if (logErr) {
      console.warn("[track-shipment] Failed to record rate limit entry");
      return new Response(
        JSON.stringify({ error: "Tracking is temporarily unavailable.", data: null }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Call database RPC track_shipment() which is granted only to service_role
    const { data, error } = await supabaseAdmin.rpc("track_shipment", {
      p_tracking: trackingNumber
    });

    if (error) {
      console.error("[track-shipment] Database RPC error");
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data || !data.tracking_number) {
      console.info("[track-shipment] Tracking number not found in database");
      return new Response(
        JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 8. Sanitize response payload:
    // Return only: status, last_updated (timestamp), service type, origin and destination as city/area only,
    // and a list of events (status text and time).
    // NEVER return names, phones, emails, full addresses, driver/vehicle details, prices, documents or internal ids.
    const rawEvents = Array.isArray(data.events) ? data.events : [];
    const sanitizedEvents = rawEvents.map((evt: any) => ({
      status: String(evt.stage || evt.status || "").trim(),
      time: evt.occurred_at || evt.time || null
    }));

    let mappedServiceType = "";
    if (data.service_type === "AIR_FREIGHT_DOCS") {
      mappedServiceType = "Air Freight Documentation Support";
    } else if (data.service_type === "ROAD_TRANSPORT") {
      mappedServiceType = "Commercial Road Transportation Coordination";
    } else if (data.service_type === "SHIPMENT_DOCS") {
      mappedServiceType = "Shipment Documentation Support";
    }

    const sanitizedData = {
      tracking_number: trackingNumber,
      status: String(data.status || "Unknown").trim(),
      last_updated: data.last_updated || null,
      service_type: mappedServiceType,
      origin: String(data.origin_city || "").trim(),
      destination: String(data.destination_city || "").trim(),
      events: sanitizedEvents
    };

    return new Response(
      JSON.stringify({ data: sanitizedData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (_err: any) {
    console.error("[track-shipment] Unhandled server error");
    return new Response(
      JSON.stringify({ error: GENERIC_NOT_FOUND_MSG, data: null }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
