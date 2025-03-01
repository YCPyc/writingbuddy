import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { assignmentService } from "@/src/domains/assignments/service";
import { assignmentRepository } from "@/src/domains/assignments/repository";
import { Assignment } from "@/src/domains/assignments/model";
import { format } from "date-fns";

type AssignmentsTabProps = {
  classCode: string;
  refreshTrigger: number;
};

export function AssignmentsTab({
  classCode,
  refreshTrigger,
}: AssignmentsTabProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const service = assignmentService(assignmentRepository(supabase));
      const data = await service.getAssignments(classCode);
      setAssignments(data);
      setLoading(false);
    };

    fetchAssignments();
  }, [classCode, refreshTrigger]);

  const handleDelete = async (assignmentCode: string) => {
    const service = assignmentService(assignmentRepository(supabase));
    const success = await service.deleteAssignment(assignmentCode);

    if (success) {
      setAssignments(
        assignments.filter((a) => a.assignment_code !== assignmentCode)
      );
    }
  };

  return (
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
                      onClick={() => handleDelete(assignment.assignment_code)}
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
  );
}
