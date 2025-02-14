import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project values from your project settings
const supabaseUrl = "http://localhost:54321";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphenVoZ2FpdmFxcGRseGNjbm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNTYxODQsImV4cCI6MjA1NDYzMjE4NH0.YhjtPHSePLBW3D673vUkCaY0pWy1Kh7r7QAP6WoOO8A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
