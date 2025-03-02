import { Database } from "../../../supabase/database.types";

export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];

export interface ReportRepository {
  insertReport(report: ReportInsert): Promise<string | null>;
  getReports(teacherId: string, assignmentCode?: string): Promise<Report[]>;
  getReport(reportId: string): Promise<Report | null>;
  deleteReport(reportId: string): Promise<boolean>;
} 