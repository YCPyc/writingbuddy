import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Separator } from "../../../ui/separator";
import { useAuth } from "../../../auth/AuthProvider";
import { supabase } from "../../../../../lib/supabaseClient";
import { reportRepository } from "../../../../domains/reports/repository";
import { reportService } from "../../../../domains/reports/service";
import { Report } from "../../../../domains/reports/model";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Trash2 } from "lucide-react";

type ReportsTabProps = {
  classCode: string;
  onCreateReport: () => void;
};

export function ReportsTab({ classCode, onCreateReport }: ReportsTabProps) {
  const { id: userId } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      if (!userId) return;

      setIsLoading(true);
      try {
        const reportServiceInstance = reportService(reportRepository(supabase));
        const fetchedReports = await reportServiceInstance.getReports(userId);
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [userId]);

  const handleDeleteReport = async (reportId: string) => {
    if (!userId) return;

    setIsDeleting(true);
    try {
      const reportServiceInstance = reportService(reportRepository(supabase));
      const success = await reportServiceInstance.deleteReport(reportId);

      if (success) {
        setReports(reports.filter((report) => report.id !== reportId));
        if (selectedReport?.id === reportId) {
          setSelectedReport(null);
        }
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignment Reports</h2>
        <Button onClick={onCreateReport}>Create New Report</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No reports found. Create your first report!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold">Saved Reports</h3>
            {reports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedReport?.id === report.id ? "border-primary" : ""
                }`}
                onClick={() =>
                  setSelectedReport(selectedReport === report ? null : report)
                }
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium truncate">
                        Report on {report.assignment_code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.created_at || "").toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReport(report.id);
                      }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="md:col-span-2">
            {selectedReport ? (
              <Card>
                <CardHeader>
                  <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedReport.content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Select a report to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
