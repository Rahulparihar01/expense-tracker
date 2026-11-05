import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusRequest {
  email: string;
}

// Only report on codes requested recently, so the endpoint cannot be used to
// mine historical reset activity for an address.
const FRESH_WINDOW_MS = 15 * 60 * 1000;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: StatusRequest = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ status: "unknown" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Most recent OTP request for this address. Only coarse fields are
    // returned — never the code, the error detail, or any other row data.
    const { data, error } = await supabaseAdmin
      .from("password_reset_otps")
      .select("email_send_status, email_sent_at, created_at")
      .eq("email", email.toLowerCase())
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return new Response(
        JSON.stringify({ status: "unknown" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const row = data[0];
    const age = Date.now() - new Date(row.created_at).getTime();
    if (age > FRESH_WINDOW_MS) {
      return new Response(
        JSON.stringify({ status: "unknown" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const status = ["pending", "sent", "failed"].includes(row.email_send_status)
      ? row.email_send_status
      : "unknown";

    return new Response(
      JSON.stringify({ status, requestedAt: row.created_at, sentAt: row.email_sent_at }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error in check-otp-email-status:", error);
    return new Response(
      JSON.stringify({ status: "unknown" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
