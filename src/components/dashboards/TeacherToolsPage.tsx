import { useState, useEffect } from "react";
import { LogoutButton } from "../auth/LogoutButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { AssignmentCreationPage } from "../assignments/AssignmentCreationPage";
import { supabase } from "@/lib/supabaseClient";
import { assignmentService } from "@/src/domains/assignments/service";
import { assignmentRepository } from "@/src/domains/assignments/repository";
import { Assignment } from "@/src/domains/assignments/model";
import { format } from "date-fns";

type TeacherToolsPageProps = {
  userId: string;
  classCode: string;
};

export function TeacherToolsPage({ userId, classCode }: TeacherToolsPageProps) {
  const [showAssignmentCreation, setShowAssignmentCreation] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    const service = assignmentService(assignmentRepository(supabase));
    const data = await service.getAssignments(classCode);
    setAssignments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, [classCode]);

  const handleDelete = async (assignmentCode: string) => {
    const service = assignmentService(assignmentRepository(supabase));
    const success = await service.deleteAssignment(assignmentCode);

    if (success) {
      setAssignments(
        assignments.filter((a) => a.assignment_code !== assignmentCode)
      );
    }
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
            fetchAssignments();
          }
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
            Class Code: <Badge variant="outline">{classCode}</Badge>
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
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your class activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full"
                  variant="default"
                  onClick={() => setShowAssignmentCreation(true)}
                >
                  Create New Assignment
                </Button>
                <Button className="w-full" variant="outline">
                  Create New Report
                </Button>
                <Button className="w-full" variant="outline">
                  View Student Progress
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Class Assignments</CardTitle>
              <CardDescription>View and manage assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : assignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No assignments created yet
                </p>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <Card key={assignment.assignment_code}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{assignment.title}</CardTitle>
                            <CardDescription>
                              Created{" "}
                              {format(new Date(assignment.created_at!), "PPP")}
                            </CardDescription>
                          </div>
                          <code className="text-xs text-muted-foreground">
                            {assignment.assignment_code}
                          </code>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {assignment.instruction}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDelete(assignment.assignment_code)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Manage your class students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No students enrolled yet
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Class Reports</CardTitle>
              <CardDescription>View and manage student reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No reports available
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
