// Shared helper for driver dispatch alerts (OFF by default)
// Secrets read: DRIVER_ALERTS_ENABLED, DRIVER_LINK_URL, DRIVER_LINK_SECRET

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const ALLOWED_CARGO_TYPES = [
  "General Commercial Goods",
  "Industrial Spares & Hardware",
  "Consumer Retail Products",
  "Exhibition & Event Materials",
  "Commercial Documents & Paperwork",
  "Custom Commercial Cargo"
];

const SG_TOWNS = [
  "Woodlands", "Changi", "Tuas", "Jurong", "Tampines", "Bedok", "Yishun", 
  "Clementi", "Ang Mo Kio", "Kallang", "Bukit Batok", "Bukit Merah", 
  "Queenstown", "Sembawang", "Sengkang", "Punggol", "Hougang", "Serangoon", 
  "Toa Payoh", "Bishan", "Pasir Ris", "Geylang", "Marine Parade", "Novena", 
  "Tanglin", "Newton", "Orchard", "Downtown Core", "HarbourFront", "Marina Bay", 
  "Pioneer", "Boon Lay", "Seletar", "Mandai", "Kranji", "Sungei Kadut", 
  "Lim Chu Kang", "Tengah", "Bukit Panjang", "Bukit Timah"
];

function extractArea(address: string | null | undefined): string {
  if (!address || typeof address !== "string") return "SG";
  const trimmed = address.trim();
  if (!trimmed) return "SG";

  // Look for a 6-digit postal code using /\b(\d{2})\d{4}\b/
  const postalMatch = trimmed.match(/\b(\d{2})\d{4}\b/);
  if (postalMatch && postalMatch[1]) {
    return postalMatch[1];
  }

  // Check for recognized town name if present in the form
  for (const town of SG_TOWNS) {
    const townRegex = new RegExp(`\\b${town}\\b`, "i");
    if (townRegex.test(trimmed)) {
      return town;
    }
  }

  return "Singapore";
}

async function signHmacSha256(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sendDriverAlert(quote: any, supabaseClient?: any): Promise<void> {
  try {
    // 1. Must do nothing and return quietly unless DRIVER_ALERTS_ENABLED === "true" AND service type is ROAD_TRANSPORT
    const isEnabled = Deno.env.get("DRIVER_ALERTS_ENABLED");
    if (isEnabled !== "true") {
      return;
    }

    const serviceType = quote?.service_type || "";
    if (serviceType !== "ROAD_TRANSPORT") {
      return;
    }

    const driverLinkUrl = (Deno.env.get("DRIVER_LINK_URL") || "").trim();
    const driverLinkSecret = (Deno.env.get("DRIVER_LINK_SECRET") || "").trim();
    if (!driverLinkUrl || !driverLinkSecret) {
      return;
    }

    const client = supabaseClient || (() => {
      const url = Deno.env.get("SUPABASE_URL") ?? "";
      const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_KEY") ?? "";
      return (url && key) ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
    })();

    const jobId = crypto.randomUUID();
    const quoteId = quote?.id ? String(quote.id) : "";

    // 2. Before sending, count rows in driver_alert_log in last hour; if >= 10, log "capped" and do not send
    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
    let isCapped = false;

    if (client) {
      try {
        const { count, error } = await client
          .from("driver_alert_log")
          .select("id", { count: "exact", head: true })
          .gte("created_at", oneHourAgo);

        if (!error && count !== null && count !== undefined && count >= 10) {
          isCapped = true;
        }
      } catch (_countErr) {
        // Non-blocking
      }
    }

    if (isCapped) {
      console.error("[driver-alert] failed capped");
      if (client) {
        try {
          await client.from("driver_alert_log").insert([
            {
              job_id: jobId,
              quote_request_id: quoteId,
              status: "capped",
              http_status: null,
            },
          ]);
        } catch (_logErr) {
          // Log failure must never stop execution
        }
      }
      return;
    }

    // 3. Message payload: cargo_type allowed only from fixed list, else "General Cargo"
    const cargoType = (quote?.cargo_classification && ALLOWED_CARGO_TYPES.includes(quote.cargo_classification))
      ? quote.cargo_classification
      : "General Cargo";

    const timestamp = Date.now().toString();
    const payload = {
      job_id: jobId,
      service: "ROAD",
      pickup_area: extractArea(quote.pickup_location),
      dropoff_area: extractArea(quote.delivery_location),
      cargo_type: cargoType,
      approx_weight_kg: quote.gross_weight_kg !== undefined && quote.gross_weight_kg !== null && quote.gross_weight_kg !== ""
        ? Number(quote.gross_weight_kg)
        : null,
      requested_date: quote.preferred_pickup_date ? String(quote.preferred_pickup_date).trim() : null,
      sent_at: new Date().toISOString(),
    };

    const jsonBody = JSON.stringify(payload);
    const dataToSign = `${timestamp}.${jsonBody}`;
    const signature = await signHmacSha256(driverLinkSecret, dataToSign);

    // 4. 3-second timeout and POST to DRIVER_LINK_URL
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    let httpStatus: number | null = null;
    let alertStatus: "sent" | "failed" = "failed";

    try {
      const res = await fetch(driverLinkUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        body: jsonBody,
        signal: controller.signal,
      });

      httpStatus = res.status;
      if (res.status >= 200 && res.status < 300) {
        alertStatus = "sent";
      } else {
        alertStatus = "failed";
        console.error(`[driver-alert] failed ${res.status}`);
      }
    } catch (_fetchErr) {
      alertStatus = "failed";
      console.error("[driver-alert] failed");
    } finally {
      clearTimeout(timeoutId);
    }

    // 5. Write one row to driver_alert_log
    if (client) {
      try {
        await client.from("driver_alert_log").insert([
          {
            job_id: jobId,
            quote_request_id: quoteId,
            status: alertStatus,
            http_status: httpStatus,
          },
        ]);
      } catch (_logErr) {
        // Log failure must never stop execution
      }
    }
  } catch (_err) {
    console.error("[driver-alert] failed");
  }
}
