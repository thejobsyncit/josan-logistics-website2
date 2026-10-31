import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Standard CORS resolution helper
function getCorsHeaders(req: Request) {
  const allowedOriginEnv = Deno.env.get("ALLOWED_ORIGIN") || "*";
  const requestOrigin = req.headers.get("origin") || "";

  let matchedOrigin = "*";
  if (allowedOriginEnv !== "*") {
    const allowedList = allowedOriginEnv.split(",").map((o) => o.trim());
    if (allowedList.includes(requestOrigin)) {
      matchedOrigin = requestOrigin;
    } else {
      matchedOrigin = allowedList[0] || "*";
    }
  }

  return {
    "Access-Control-Allow-Origin": matchedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// Simple email regex validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  // 1. Accept only POST and OPTIONS
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
      return new Response(
        JSON.stringify({ error: "Invalid request payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Honeypot check: silently succeed if hidden "website" field is filled
    if (body.website && String(body.website).trim() !== "") {
      const dummyCode = String(Math.floor(1000 + Math.random() * 9000));
      return new Response(
        JSON.stringify({ reference: `QR-${dummyCode}-${dummyCode}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Verify Cloudflare Turnstile token on the server
    const turnstileToken = (body.turnstile_token || body.token || "").trim();
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";

    if (!turnstileSecret) {
      console.error("[submit-quote] Server error: TURNSTILE_SECRET_KEY not configured in environment");
      return new Response(
        JSON.stringify({ error: "Verification service unconfigured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ error: "Security verification token missing" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verifyFormData = new FormData();
    verifyFormData.append("secret", turnstileSecret);
    verifyFormData.append("response", turnstileToken);

    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verifyFormData,
    });
    const turnstileResult = await turnstileRes.json().catch(() => ({ success: false }));

    if (!turnstileResult.success) {
      return new Response(
        JSON.stringify({ error: "Security verification failed. Please refresh and try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Validate all request fields on the server
    const validServiceTypes = ["AIR_FREIGHT_DOCS", "ROAD_TRANSPORT", "SHIPMENT_DOCS"];
    const serviceType = String(body.service_type || "").trim();
    if (!validServiceTypes.includes(serviceType)) {
      return new Response(
        JSON.stringify({ error: "Invalid service type requested" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contactName = String(body.contact_name || "").trim();
    if (!contactName || contactName.length > 100) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid contact name (max 100 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contactEmail = String(body.contact_email || "").trim().toLowerCase();
    if (!contactEmail || contactEmail.length > 120 || !EMAIL_REGEX.test(contactEmail)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address (max 120 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Consent check
    if (body.consent_given !== true && body.consent_given !== "true") {
      return new Response(
        JSON.stringify({ error: "Data processing consent is required to submit a quote request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pickup date validation
    const preferredPickupDateStr = String(body.preferred_pickup_date || "").trim();
    if (!preferredPickupDateStr || isNaN(Date.parse(preferredPickupDateStr))) {
      return new Response(
        JSON.stringify({ error: "Please select a valid preferred pickup date" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Numeric limits
    const packages = body.packages !== undefined && body.packages !== null && body.packages !== "" 
      ? Number(body.packages) 
      : null;
    if (packages !== null && (!Number.isInteger(packages) || packages < 1 || packages > 10000)) {
      return new Response(
        JSON.stringify({ error: "Package count must be an integer between 1 and 10,000" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const grossWeight = body.gross_weight_kg !== undefined && body.gross_weight_kg !== null && body.gross_weight_kg !== ""
      ? Number(body.gross_weight_kg)
      : null;
    if (grossWeight !== null && (isNaN(grossWeight) || grossWeight < 0 || grossWeight > 100000)) {
      return new Response(
        JSON.stringify({ error: "Gross weight must be between 0 and 100,000 kg" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lengthCm = body.length_cm !== undefined && body.length_cm !== null && body.length_cm !== ""
      ? Number(body.length_cm)
      : null;
    if (lengthCm !== null && (isNaN(lengthCm) || lengthCm < 0 || lengthCm > 2500)) {
      return new Response(
        JSON.stringify({ error: "Length must be between 0 and 2,500 cm" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const widthCm = body.width_cm !== undefined && body.width_cm !== null && body.width_cm !== ""
      ? Number(body.width_cm)
      : null;
    if (widthCm !== null && (isNaN(widthCm) || widthCm < 0 || widthCm > 500)) {
      return new Response(
        JSON.stringify({ error: "Width must be between 0 and 500 cm" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const heightCm = body.height_cm !== undefined && body.height_cm !== null && body.height_cm !== ""
      ? Number(body.height_cm)
      : null;
    if (heightCm !== null && (isNaN(heightCm) || heightCm < 0 || heightCm > 500)) {
      return new Response(
        JSON.stringify({ error: "Height must be between 0 and 500 cm" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Optional text fields with maximum length enforcement
    const contactPhone = body.contact_phone ? String(body.contact_phone).trim().slice(0, 30) : null;
    const companyName = body.company_name ? String(body.company_name).trim().slice(0, 120) : null;
    const pickupLocation = body.pickup_location ? String(body.pickup_location).trim().slice(0, 255) : null;
    const deliveryLocation = body.delivery_location ? String(body.delivery_location).trim().slice(0, 255) : null;
    const cargoClassification = body.cargo_classification ? String(body.cargo_classification).trim().slice(0, 100) : null;
    const cargoDescription = body.cargo_description ? String(body.cargo_description).trim().slice(0, 500) : null;
    const roadLoadType = body.road_load_type ? String(body.road_load_type).trim().slice(0, 50) : null;
    const addDocumentation = Boolean(body.add_documentation);
    const copyToCustomer = Boolean(body.copy_to_customer);

    // 8. Connect to Supabase using service-role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[submit-quote] Server error: Supabase service-role credentials missing in Deno.env");
      return new Response(
        JSON.stringify({ error: "Database service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 5. Rate limiting: reject if same contact_email >= 3 in last hour or overall >= 60 in last hour
    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();

    const [overallRes, emailRes] = await Promise.all([
      supabaseAdmin
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .gte("created_at", oneHourAgo),
      supabaseAdmin
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("contact_email", contactEmail)
        .gte("created_at", oneHourAgo),
    ]);

    if ((overallRes.count ?? 0) >= 60) {
      return new Response(
        JSON.stringify({ error: "Server busy. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if ((emailRes.count ?? 0) >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many requests from this email. Please wait an hour before submitting again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 6. Insert one row: reference generated by set_quote_reference trigger; quoted_amount null; is_test false; customer_id null
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("quote_requests")
      .insert([
        {
          service_type: serviceType,
          road_load_type: roadLoadType,
          add_documentation: addDocumentation,
          pickup_location: pickupLocation,
          delivery_location: deliveryLocation,
          preferred_pickup_date: preferredPickupDateStr,
          cargo_classification: cargoClassification,
          cargo_description: cargoDescription,
          packages: packages,
          gross_weight_kg: grossWeight,
          length_cm: lengthCm,
          width_cm: widthCm,
          height_cm: heightCm,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          company_name: companyName,
          consent_given: true,
          consent_at: new Date().toISOString(),
          copy_to_customer: copyToCustomer,
          status: "New",
          is_test: false,
          customer_id: null,
          quoted_amount: null,
        },
      ])
      .select("reference")
      .single();

    if (insertError || !inserted?.reference) {
      console.error("[submit-quote] Insert error occurred");
      return new Response(
        JSON.stringify({ error: "Failed to submit quote request. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Insert one notification for each active staff member with role ADMIN or CRM
    try {
      const { data: staffMembers } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .in("role", ["ADMIN", "CRM"])
        .eq("status", "Active");

      if (staffMembers && staffMembers.length > 0) {
        const notificationRecords = staffMembers.map((staff: { id: string }) => ({
          user_id: staff.id,
          title: "New quote request",
          body: `Reference ${inserted.reference}`,
          link: "/#crm-quotations",
        }));
        await supabaseAdmin.from("notifications").insert(notificationRecords);
      }
    } catch (_notifErr) {
      // Non-blocking for the customer response
    }

    // 9. Return only { reference } on success
    return new Response(
      JSON.stringify({ reference: inserted.reference }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[submit-quote] Unexpected error occurred");
    return new Response(
      JSON.stringify({ error: "Unable to process quote request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

