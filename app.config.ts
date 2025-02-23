declare module "wxt/sandbox" {
  export interface WxtAppConfig {
    supabaseUrl: string;
    supabaseKey: string;
    openaiApiKey: string;
    standardsApiKey: string;
  }
}

export default defineAppConfig({
  supabaseUrl: import.meta.env.WXT_SUPABASE_URL,
  supabaseKey: import.meta.env.WXT_SUPABASE_KEY,
  openaiApiKey: import.meta.env.WXT_OPENAI_API_KEY,
  standardsApiKey: import.meta.env.WXT_COMMON_STANDARD_API_KEY,
});
