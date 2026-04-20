// Sokoni Assistant Edge Function
// Handles high-scale operations: conversation storage, analytics, search aggregation
// Serves 500+ concurrent users via Supabase Edge Functions

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting map (in-memory, per-instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 60; // 60 requests per minute

  const entry = rateLimitMap.get(clientId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  // Get user from JWT
  const authHeader = req.headers.get("authorization");
  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });

  let userId: string | null = null;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await userClient.auth.getUser(token);
    userId = user?.id || null;
  }

  // Rate limiting by user or IP
  const clientId = userId || req.headers.get("x-real-ip") || "anonymous";
  if (!checkRateLimit(clientId)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please slow down." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const body = await req.json();
    const { action, data } = body;

    // ============================================
    // AI CHAT (streaming, with tool calling)
    // ============================================
    if (action === "chat") {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: "AI not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { messages = [], username, isLoggedIn } = data || {};

      const systemPrompt = `You are Sokoni Assistant — the friendly, witty, deeply knowledgeable AI guide for SokoniArena, Kenya's social marketplace.

ABOUT SOKONIARENA:
- Kenya's social marketplace for products, services, events, and shops
- Users can browse, post listings, open shops, message sellers, save favorites
- Has a social layer called Fun Circle (stories, friends, reactions)
- Mobile-first PWA, M-Pesa friendly, prices in KES
- Free to browse and post basic listings; premium features (Featured listings, Sponsored ads, Shop promotions) are paid

PAGES YOU CAN NAVIGATE TO:
/ (home), /products, /services, /events, /shops, /fun-circle, /favorites, /messages, /dashboard, /login, /register, /how-it-works, /terms, /privacy, /search?q=...

KEY GUIDES:
- Post listing: Sign in → Dashboard → New Listing → fill details → Publish
- Open shop: Dashboard → My Shop → add name/logo/cover → submit for approval
- Promote shop: Dashboard → My Shop → Request Promotion
- Feature listing: Dashboard → listing → Request Featured/Sponsorship
- Contact seller: open listing → Call/WhatsApp/Message buttons (sign in required for in-app)
- Favorites: tap heart on any listing → view in /favorites
- Reset password: /forgot-password → enter email → click link

SAFETY: Meet in public, inspect items first, never pay before seeing item, prefer verified shops.

YOU HAVE TOOLS:
- search_marketplace: when user wants to find products, services, events or shops (parses location, price filters automatically server-side). Use this whenever they say "find/show/look for/I want X".
- navigate: when user wants to go to a specific page.
- end_session: when user says goodbye/bye/stop/end session.

USER CONTEXT:
- Logged in: ${isLoggedIn ? "yes" : "no"}
- Username: ${username || "guest"}

STYLE:
- Warm, concise, conversational (this will be spoken aloud — keep replies under 3 sentences when possible).
- Mix in light Swahili greetings when natural (karibu, asante, sawa).
- Never invent products or shops — use search_marketplace to find real data.
- If unsure, ask one short clarifying question.
- If user asks for personal stuff (my listings, my shop) and isn't logged in, tell them to sign in first.`;

      const tools = [
        {
          type: "function",
          function: {
            name: "search_marketplace",
            description: "Search SokoniArena for products, services, events or shops. Returns matches and navigates user to /search.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "What to search for, in natural language. Can include location and price hints (e.g. 'iPhones under 30k in Nairobi')." },
              },
              required: ["query"],
              additionalProperties: false,
            },
          },
        },
        {
          type: "function",
          function: {
            name: "navigate",
            description: "Navigate the user to a specific page on SokoniArena.",
            parameters: {
              type: "object",
              properties: {
                path: { type: "string", description: "App path starting with /, e.g. /shops, /dashboard, /favorites." },
              },
              required: ["path"],
              additionalProperties: false,
            },
          },
        },
        {
          type: "function",
          function: {
            name: "end_session",
            description: "End the live voice session when the user says goodbye.",
            parameters: { type: "object", properties: {}, additionalProperties: false },
          },
        },
      ];

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          stream: true,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          tools,
        }),
      });

      if (!aiResp.ok) {
        if (aiResp.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limits exceeded, please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (aiResp.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errTxt = await aiResp.text();
        console.error("AI gateway error:", aiResp.status, errTxt);
        return new Response(
          JSON.stringify({ error: "AI gateway error" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(aiResp.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // ============================================
    // STORE CONVERSATION MESSAGE
    // ============================================
    if (action === "store_message") {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { conversation_id, role, content, intent_type, action_taken, metadata } = data;

      // Get or create conversation
      let convId = conversation_id;
      if (!convId) {
        const { data: newConv, error: convError } = await adminClient
          .from("assistant_conversations")
          .insert({
            user_id: userId,
            is_active: true,
          })
          .select("id")
          .single();

        if (convError) throw convError;
        convId = newConv.id;
      }

      // Update last activity
      await adminClient
        .from("assistant_conversations")
        .update({ last_activity_at: new Date().toISOString() })
        .eq("id", convId);

      // Insert message
      const { data: message, error: msgError } = await adminClient
        .from("assistant_messages")
        .insert({
          conversation_id: convId,
          user_id: userId,
          role,
          content,
          intent_type,
          action_taken,
          metadata,
        })
        .select()
        .single();

      if (msgError) throw msgError;

      return new Response(
        JSON.stringify({ success: true, conversation_id: convId, message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================
    // END CONVERSATION
    // ============================================
    if (action === "end_conversation") {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { conversation_id } = data;

      await adminClient
        .from("assistant_conversations")
        .update({
          is_active: false,
          ended_at: new Date().toISOString(),
        })
        .eq("id", conversation_id)
        .eq("user_id", userId);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================
    // GET CONVERSATION HISTORY
    // ============================================
    if (action === "get_history") {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { limit = 50, offset = 0 } = data || {};

      const { data: conversations, error } = await adminClient
        .from("assistant_conversations")
        .select(`
          *,
          messages:assistant_messages(*)
        `)
        .eq("user_id", userId)
        .order("started_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, conversations }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================
    // LOG ANALYTICS EVENT
    // ============================================
    if (action === "log_analytics") {
      const { event_type, event_data, session_id } = data;

      await adminClient
        .from("assistant_analytics")
        .insert({
          user_id: userId,
          session_id: session_id || crypto.randomUUID(),
          event_type,
          event_data,
        });

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================
    // ADMIN: GET ALL CONVERSATIONS (for troubleshooting)
    // ============================================
    if (action === "admin_get_all_conversations") {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user is admin
      const { data: isAdmin } = await adminClient.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { limit = 100, offset = 0, date_from, date_to } = data || {};

      let query = adminClient
        .from("assistant_conversations")
        .select(`
          *,
          user:profiles(username, email),
          message_count:assistant_messages(count)
        `)
        .order("started_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (date_from) {
        query = query.gte("started_at", date_from);
      }
      if (date_to) {
        query = query.lte("started_at", date_to);
      }

      const { data: conversations, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, conversations }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Sokoni Assistant Error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});