import { SupabaseClient } from "@supabase/supabase-js";
import { Assignment, AssignmentInsert, AssignmentRepository } from "./model";
import { Database } from "../../../supabase/database.types";

export function assignmentRepository(
  client: SupabaseClient<Database>
): AssignmentRepository {
  return {
    async insertAssignment(assignment: AssignmentInsert): Promise<string | null> {
      const { data, error } = await client
        .from("assignments")
        .insert(assignment)
        .select("assignment_code")
        .single();

      if (error) {
        console.error("Error inserting assignment:", error);
        return null;
      }

      return data.assignment_code;
    },

    async getClassAssignments(classCode: string): Promise<Assignment[]> {
      const { data, error } = await client
        .from("assignments")
        .select("*")
        .eq("class_code", classCode)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching assignments:", error);
        return [];
      }

      return data;
    },

    async deleteAssignment(assignmentCode: string): Promise<boolean> {
      const { error } = await client
        .from("assignments")
        .delete()
        .eq("assignment_code", assignmentCode);

      if (error) {
        console.error("Error deleting assignment:", error);
        return false;
      }

      return true;
    },

    async getAssignmentChatHistory(assignmentCode: string): Promise<any[]> {
      const { data, error } = await client
        .from("chat_history")
        .select("messages")
        .eq("assignment_code", assignmentCode)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching chat history:", error);
        return [];
      }

      // Extract messages from all chat history entries
      const allMessages = data.flatMap(entry => entry.messages || []);

      return allMessages;
    },
  };
} 