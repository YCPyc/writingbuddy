import { Errorable } from "../utils/errorable";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/supabase/database.types";
import { ChatHistory } from "./model";

export interface ChatHistoryRepository {
  createChatHistory(
    student_id: string,
    tool_name: string,
    messages: any
  ): Promise<Errorable<ChatHistory>>;
}

export const chatHistoryRepository = (
  client: SupabaseClient<Database>
): ChatHistoryRepository => {
  return {
    createChatHistory: async (
      student_id: string,
      tool_name: string,
      messages: any
    ) => {
      const { data, error } = await client
        .from("chat_history")
        .insert({
          student_id: student_id,
          tool_name: tool_name,
          messages: [JSON.stringify(messages)],
        })
        .select("*")
        .single();

      if (error) return { data: null, error };
      return { data, error: null };
    },
  };
};
