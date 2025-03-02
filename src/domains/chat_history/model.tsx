interface ChatMessages {
  praise: string;
  improvements: string[];
}

export interface ChatHistory {
  id: string;
  messages: any;
  student_id: string;
  tool_name: string;
  created_at: string | null;
  updated_at: string | null;
}
