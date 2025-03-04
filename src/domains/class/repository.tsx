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
  joinAssignment(
    classCode: string,
    studentId: string
  ): Promise<Errorable<Profile>>;
  getClass(classCode: string): Promise<Errorable<Class>>;
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
    joinAssignment: async (classCode: string, studentId: string) => {
      try {
        // First, check if the assignment exists
        const { data: assignmentData, error: assignmentCheckError } =
          await client
            .from("assignments")
            .select("assignment_code")
            .eq("assignment_code", classCode)
            .single();

        if (assignmentCheckError) {
          return { data: null, error: "Invalid assignment code" };
        }

        // Update the student's profile with the assignment code
        const { data: profileData, error: profileError } = await client
          .from("profiles")
          .update({ assignment_code: classCode })
          .eq("id", studentId)
          .eq("role", "student")
          .select("*")
          .single();

        if (profileError) {
          return { data: null, error: profileError.message };
        }

        // Add an entry to the student_assignment table
        // Using upsert to handle the case where the student is already assigned to this assignment
        const { error: assignmentError } = await client
          .from("student_assignment")
          .upsert(
            {
              student_id: studentId,
              assignment_code: classCode,
            },
            {
              onConflict: "student_id,assignment_code",
              ignoreDuplicates: true,
            }
          );

        if (assignmentError) {
          console.error(
            "Error adding student_assignment entry:",
            assignmentError
          );
          // We'll continue even if this fails, as the profile update is the primary operation
        }

        return { data: profileData, error: null };
      } catch (err) {
        console.error("Error joining assignment:", err);
        return {
          data: null,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    },
    getClass: async (classCode: string) => {
      const { data, error } = await client
        .from("classes")
        .select("*")
        .eq("class_code", classCode)
        .single();

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    },
  };
};
