import { Errorable } from "../utils/errorable";
import { User } from "./model";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/supabase/database.types";

export interface UserRepository {
  fetchUserInfo(userId: string): Promise<Errorable<User>>;
  updateClassCode(userId: string, classCode: string): Promise<Errorable<User>>;
}

export const userRepository = (
  client: SupabaseClient<Database>
): UserRepository => {
  return {
    fetchUserInfo: async (userId: string) => {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data: data, error: null };
    },
    updateClassCode: async (userId: string, classCode: string) => {
      const { data, error } = await client
        .from("profiles")
        .update({ class_code: classCode })
        .eq("id", userId)
        .select("*")
        .single();

      if (error) throw error;
      return { data: data, error: null };
    },
  };
};
