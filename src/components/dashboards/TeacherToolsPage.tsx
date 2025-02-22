import { useState } from "react";
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

type TeacherToolsPageProps = {
  userId: string;
  classCode: string;
};

export function TeacherToolsPage({ userId, classCode }: TeacherToolsPageProps) {
  const [showAssignmentCreation, setShowAssignmentCreation] = useState(false);

  if (showAssignmentCreation) {
    return (
      <AssignmentCreationPage onBack={() => setShowAssignmentCreation(false)} />
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
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
