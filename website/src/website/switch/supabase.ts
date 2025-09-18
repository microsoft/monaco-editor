import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL as string;
const key = process.env.SUPABASE_ANON_KEY as string;
export const supabase: SupabaseClient | undefined =
	url && key ? createClient(url, key) : undefined;
