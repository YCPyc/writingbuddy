import { Database } from "../../../supabase/database.types";

export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type AssignmentWithChatHistory = Assignment & {
  chat_history: any[];
};
export type AssignmentInsert = Database["public"]["Tables"]["assignments"]["Insert"];

export interface StudentAssignment {
  assignment_code: string;
  title: string;
  due_date: string | null;
  instruction: string;
  rubric: string | null;
  created_at: string | null;
}

export interface AssignmentRepository {
  insertAssignment(assignment: AssignmentInsert): Promise<string | null>;
  getClassAssignments(classCode: string): Promise<Assignment[]>;
  getAssignmentDetails(assignmentCode: string): Promise<Assignment | null>;
  deleteAssignment(assignmentCode: string): Promise<boolean>;
  getAssignmentChatHistory(assignmentCode: string): Promise<any[]>;
  getStudentAssignments(studentId: string): Promise<StudentAssignment[] | null>;
} 