import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/database.types";

const supabaseUrl = import.meta.env.WXT_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.WXT_SUPABASE_ANON_KEY as string;
console.log(supabaseUrl, supabaseAnonKey);
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
