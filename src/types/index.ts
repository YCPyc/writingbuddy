export type UserRole = "teacher" | "student" ;

export type ExtendedManifest = chrome.runtime.ManifestV3 & {
  oauth2?: {
    client_id: string;
    scopes: string[];
  };
};
