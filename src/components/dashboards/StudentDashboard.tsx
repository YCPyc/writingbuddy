import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { StudentToolsPage } from "./StudentToolsPage";

type StudentDashboardProps = {
  userId: string;
};

export function StudentDashboard({ userId }: StudentDashboardProps) {
  const [assignmentCode, setAssignmentCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAssignment, setHasAssignment] = useState(false);

  const handleJoinAssignment = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // First verify the assignment exists
      const { data: assignment, error: assignmentError } = await supabase
        .from("assignments")
        .select("assignment_code")
        .eq("assignment_code", assignmentCode)
        .single();

      if (assignmentError || !assignment) {
        setError("Invalid assignment code. Please check and try again.");
        return;
      }

      // Update the student's profile with the assignment code
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ assignment_code: assignmentCode })
        .eq("id", userId);

      if (updateError) {
        setError("Failed to join assignment. Please try again.");
        return;
      }

      setHasAssignment(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (hasAssignment) {
    return <StudentToolsPage userId={userId} assignmentCode={assignmentCode} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Join Assignment</CardTitle>
          <CardDescription>
            Enter the assignment code provided by your teacher
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter assignment code"
              value={assignmentCode}
              onChange={(e) => setAssignmentCode(e.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button
            className="w-full"
            onClick={handleJoinAssignment}
            disabled={!assignmentCode || isLoading}
          >
            {isLoading ? "Joining..." : "Join Assignment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
