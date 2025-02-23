import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: () => ({
    key: import.meta.env.WXT_OAUTH_GOOGLE_KEY,
    permissions: ["identity", "scripting", "activeTab"],
    host_permissions: [
      "https://docs.google.com/document/*",
      "https://docs.google.com/*",
      "https://www.googleapis.com/*",
      "https://commonstandardsproject.com/*",
    ],
    oauth2: {
      client_id: import.meta.env.WXT_OAUTH_GOOGLE_CLIENT_ID,
      scopes: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/documents",
        "https://www.googleapis.com/auth/drive.file",
      ],
    },
  }),
});
