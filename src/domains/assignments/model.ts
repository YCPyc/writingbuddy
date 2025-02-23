import { Database } from "../../../supabase/database.types";

export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type AssignmentInsert = Database["public"]["Tables"]["assignments"]["Insert"];

export interface AssignmentRepository {
  insertAssignment(assignment: AssignmentInsert): Promise<string | null>;
  getClassAssignments(classCode: string): Promise<Assignment[]>;
  deleteAssignment(assignmentCode: string): Promise<boolean>;
} 