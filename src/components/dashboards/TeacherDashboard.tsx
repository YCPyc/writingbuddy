import { useState } from "react";
import { CreateClassForm } from "../class/CreateClassForm";
import { TeacherToolsPage } from "./teacher/TeacherToolsPage";
import { useAuth } from "../auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type TeacherDashboardProps = {
  userId: string;
};

export function TeacherDashboard({ userId }: TeacherDashboardProps) {
  const { classCode } = useAuth();
  const [showToolsPage, setShowToolsPage] = useState(false);

  if ((showToolsPage && classCode) || classCode) {
    return <TeacherToolsPage userId={userId} classCode={classCode || ""} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-lime-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Writing Buddy</h1>
          <p className="text-lime-700 mt-2">Teacher Dashboard</p>
        </div>

        <Card className="border-lime-100 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Create a Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateClassForm
              userId={userId}
              setShowToolsPage={setShowToolsPage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
