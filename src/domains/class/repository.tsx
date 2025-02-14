import { supabase } from "@/lib/supabaseClient";
import { Errorable } from "../utils/errorable";
import { Class, Profile } from "./model";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/supabase/database.types";

export interface ClassRepository {
  createClass(
    className: string,
    teacherId: string,
    classCode: string
  ): Promise<Errorable<Class>>;
  joinClass(classCode: string, studentId: string): Promise<Errorable<Profile>>;
}

export const classRepository = (
  client: SupabaseClient<Database>
): ClassRepository => {
  return {
    createClass: async (
      className: string,
      teacherId: string,
      classCode: string
    ) => {
      console.log(className, teacherId, classCode);
      const { data, error } = await client
        .from("classes")
        .insert({
          class_name: className,
          teacher_id: teacherId,
          class_code: classCode,
        })
        .select("*")
        .single();
      console.log(data, error);
      if (error) throw error;
      return { data: data, error: null };
    },
    joinClass: async (classCode: string, studentId: string) => {
      const { data, error } = await client
        .from("profiles")
        .update({ class_code: classCode })
        .eq("id", studentId)
        .eq("role", "student")
        .select("*")
        .single();

      if (error) throw error;
      return { data: data, error: null };
    },
  };
};
