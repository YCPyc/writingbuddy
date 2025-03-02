import { Report, ReportInsert, ReportRepository } from "./model";

export function reportService(reportRepository: ReportRepository) {
  return {
    createReport: async (report: ReportInsert): Promise<string | null> => {
      return await reportRepository.insertReport(report);
    },
    
    getReports: async (teacherId: string, assignmentCode?: string): Promise<Report[]> => {
      return await reportRepository.getReports(teacherId, assignmentCode);
    },
    
    getReport: async (reportId: string): Promise<Report | null> => {
      return await reportRepository.getReport(reportId);
    },
    
    deleteReport: async (reportId: string): Promise<boolean> => {
      return await reportRepository.deleteReport(reportId);
    }
  };
} 