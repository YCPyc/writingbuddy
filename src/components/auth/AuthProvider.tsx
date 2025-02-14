import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/src/domains/user/model";
import { ExtendedManifest } from "@/src/types";
import { userRepository } from "@/src/domains/user/repository";
import { userService } from "@/src/domains/user/service";

type AuthContextType = {
  id: string | null;
  email: string | null;
  role: string | null;
  classCode: string | null;
  setRole: (role: string | null) => void;
  setClassCode: (classCode: string | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [classCode, setClassCode] = useState<string | null>(null);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("session", session);
      fetchUserInfo(
        session?.user?.id ?? "",
        setId,
        setEmail,
        setRole,
        setClassCode
      );
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session", session);
      fetchUserInfo(
        session?.user?.id ?? "",
        setId,
        setEmail,
        setRole,
        setClassCode
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserInfo = async (
    userId: string,
    setId: (id: string | null) => void,
    setEmail: (email: string | null) => void,
    setRole: (role: string | null) => void,
    setClassCode: (classCode: string | null) => void
  ) => {
    const newUserService = userService(userRepository(supabase));
    console.log("fetching user info for", userId);
    const { data, error } = await newUserService.fetchUserInfo(userId);
    console.log("data", data);
    if (error) {
      console.error("Error fetching user info:", error);
      throw error;
    } else {
      setEmail(data?.email || null);
      setRole(data?.role || null);
      setClassCode(data?.class_code || null);
      setId(data?.id || null);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const manifest = chrome.runtime.getManifest() as ExtendedManifest;
      if (!manifest.oauth2?.client_id) {
        throw new Error("OAuth2 client_id missing in manifest");
      }

      const url = new URL("https://accounts.google.com/o/oauth2/auth");

      // Set parameters exactly as in Supabase docs
      url.searchParams.set("client_id", manifest.oauth2.client_id);
      url.searchParams.set("response_type", "id_token");
      url.searchParams.set("access_type", "offline");
      url.searchParams.set(
        "redirect_uri",
        `https://${chrome.runtime.id}.chromiumapp.org`
      );
      url.searchParams.set("scope", manifest.oauth2.scopes.join(" "));

      console.log(
        "redirect_uri",
        `https://${chrome.runtime.id}.chromiumapp.org`
      );
      console.log("Auth URL:", url.toString());

      chrome.identity.launchWebAuthFlow(
        {
          url: url.href,
          interactive: true,
        },
        async (redirectedTo) => {
          if (chrome.runtime.lastError) {
            console.error("Auth error:", chrome.runtime.lastError);
            return;
          }

          if (!redirectedTo) {
            console.error("No redirect URL received");
            return;
          }

          // Extract the ID token as shown in Supabase docs
          const url = new URL(redirectedTo);
          const params = new URLSearchParams(url.hash.substring(1));
          const idToken = params.get("id_token");

          if (!idToken) {
            console.error("No ID token in response");
            return;
          }

          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: idToken,
          });

          if (error) {
            console.error("Supabase auth failed:", error);
          } else {
            console.log("Signed in successfully:", data);
          }
        }
      );
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setEmail(null);
      setRole(null);
      setClassCode(null);
      setId(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        id,
        email,
        role,
        classCode,
        setRole,
        setClassCode,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
