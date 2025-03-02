import { useState, useEffect } from "react";
import { LogoutButton } from "../../auth/LogoutButton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { AssignmentCreationPage } from "../../assignments/AssignmentCreationPage";
import { ReportCreationPage } from "../../reports/ReportCreationPage";
import { supabase } from "@/lib/supabaseClient";
import { classService } from "@/src/domains/class/service";
import { classRepository } from "@/src/domains/class/repository";
import { OverviewTab } from "./tabs/OverviewTab";
import { AssignmentsTab } from "./tabs/AssignmentsTab";
import { ReportsTab } from "./tabs/ReportsTab";

type TeacherToolsPageProps = {
  userId: string;
  classCode: string;
};

export function TeacherToolsPage({ userId, classCode }: TeacherToolsPageProps) {
  const [showAssignmentCreation, setShowAssignmentCreation] = useState(false);
  const [showReportCreation, setShowReportCreation] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [className, setClassName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreateReport, setShowCreateReport] = useState(false);

  useEffect(() => {
    // Fetch class name
    const fetchClassName = async () => {
      const service = classService(classRepository(supabase));
      const { data, error } = await service.getClass(classCode);
      if (error) {
        console.error("Error fetching class:", error);
      } else if (data) {
        setClassName(data.class_name);
      }
    };

    fetchClassName();
  }, [classCode]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (showAssignmentCreation) {
    return (
      <AssignmentCreationPage
        onBack={() => setShowAssignmentCreation(false)}
        classCode={classCode}
        onSuccess={(tab, shouldRefetch) => {
          setShowAssignmentCreation(false);
          setActiveTab(tab);
          if (shouldRefetch) {
            handleRefresh();
          }
        }}
      />
    );
  }

  if (showReportCreation) {
    return (
      <ReportCreationPage
        onBack={() => setShowReportCreation(false)}
        classCode={classCode}
        onSuccess={(tab) => {
          setShowReportCreation(false);
          setActiveTab(tab);
          handleRefresh();
        }}
      />
    );
  }

  if (showCreateReport) {
    return (
      <ReportCreationPage
        onBack={() => setShowCreateReport(false)}
        classCode={classCode}
        onSuccess={(tab) => {
          setShowCreateReport(false);
          setActiveTab(tab);
        }}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Class: <Badge variant="outline">{className || "Loading..."}</Badge>
          </p>
        </div>
        <Button variant="outline" onClick={() => {}}>
          <LogoutButton />
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            onCreateAssignment={() => setShowAssignmentCreation(true)}
            onCreateReport={() => setShowReportCreation(true)}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsTab
            classCode={classCode}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsTab
            classCode={classCode}
            onCreateReport={() => setShowCreateReport(true)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
