// Conversation persistence for Sokoni Assistant.
// Stores logged-in users' conversations in localStorage (free, instant).
// Optional Supabase persistence: if `assistant_messages` table exists, also writes there.
// Schema (run as a migration when you're ready):
//
//   create table public.assistant_conversations (
//     id uuid primary key default gen_random_uuid(),
//     user_id uuid not null references auth.users(id) on delete cascade,
//     started_at timestamptz not null default now(),
//     ended_at timestamptz
//   );
//   create table public.assistant_messages (
//     id uuid primary key default gen_random_uuid(),
//     conversation_id uuid not null references public.assistant_conversations(id) on delete cascade,
//     user_id uuid not null references auth.users(id) on delete cascade,
//     role text not null check (role in ('user','assistant')),
//     content text not null,
//     created_at timestamptz not null default now()
//   );
//   alter table public.assistant_conversations enable row level security;
//   alter table public.assistant_messages enable row level security;
//   create policy "own_convos" on public.assistant_conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
//   create policy "own_msgs"  on public.assistant_messages       for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

import { supabase } from "@/integrations/supabase/untyped-client";

export type StoredMsg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
};

const LS_KEY = (userId: string) => `sokoni-assistant:history:${userId}`;
const CONV_KEY = (userId: string) => `sokoni-assistant:conv:${userId}`;

export function loadHistory(userId: string): StoredMsg[] {
  try {
    const raw = localStorage.getItem(LS_KEY(userId));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(-100) : [];
  } catch {
    return [];
  }
}

export function appendLocal(userId: string, msg: StoredMsg) {
  try {
    const list = loadHistory(userId);
    list.push(msg);
    // cap at 200 messages locally
    const trimmed = list.slice(-200);
    localStorage.setItem(LS_KEY(userId), JSON.stringify(trimmed));
  } catch {
    /* ignore quota */
  }
}

export function clearHistory(userId: string) {
  try {
    localStorage.removeItem(LS_KEY(userId));
    localStorage.removeItem(CONV_KEY(userId));
  } catch { /* ignore */ }
}

async function getOrCreateConversation(userId: string): Promise<string | null> {
  try {
    const cached = localStorage.getItem(CONV_KEY(userId));
    if (cached) return cached;
    const { data, error } = await supabase
      .from("assistant_conversations")
      .insert({ user_id: userId })
      .select("id")
      .maybeSingle();
    if (error || !data?.id) return null;
    localStorage.setItem(CONV_KEY(userId), data.id);
    return data.id;
  } catch {
    return null;
  }
}

// Best-effort cloud persistence — silently no-ops if table doesn't exist.
export async function persistMessage(userId: string, role: "user" | "assistant", text: string) {
  try {
    const convId = await getOrCreateConversation(userId);
    if (!convId) return;
    await supabase.from("assistant_messages").insert({
      conversation_id: convId,
      user_id: userId,
      role,
      content: text,
    });
  } catch {
    /* table may not exist yet — local storage already has it */
  }
}

export function endConversation(userId: string) {
  try {
    const convId = localStorage.getItem(CONV_KEY(userId));
    localStorage.removeItem(CONV_KEY(userId));
    if (!convId) return;
    supabase
      .from("assistant_conversations")
      .update({ ended_at: new Date().toISOString() })
      .eq("id", convId)
      .then(() => {/* ignore */}, () => {/* ignore */});
  } catch { /* ignore */ }
}
