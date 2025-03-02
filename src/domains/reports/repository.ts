import { SupabaseClient } from "@supabase/supabase-js";
import { Report, ReportInsert, ReportRepository } from "./model";
import { Database } from "../../../supabase/database.types";

export function reportRepository(
  client: SupabaseClient<Database>
): ReportRepository {
  return {
    async insertReport(report: ReportInsert): Promise<string | null> {
      const { data, error } = await client
        .from("reports")
        .insert(report)
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting report:", error);
        return null;
      }

      return data.id;
    },

    async getReports(teacherId: string, assignmentCode?: string): Promise<Report[]> {
      let query = client
        .from("reports")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("created_at", { ascending: false });
      
      // Add assignment filter if provided
      if (assignmentCode) {
        query = query.eq("assignment_code", assignmentCode);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reports:", error);
        return [];
      }

      return data;
    },

    async getReport(reportId: string): Promise<Report | null> {
      const { data, error } = await client
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (error) {
        console.error("Error fetching report:", error);
        return null;
      }

      return data;
    },

    async deleteReport(reportId: string): Promise<boolean> {
      const { error } = await client
        .from("reports")
        .delete()
        .eq("id", reportId);

      if (error) {
        console.error("Error deleting report:", error);
        return false;
      }

      return true;
    }
  };
} 