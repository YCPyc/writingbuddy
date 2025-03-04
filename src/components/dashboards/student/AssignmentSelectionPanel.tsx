import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Loader2, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { assignmentRepository } from "@/src/domains/assignments/repository";
import { assignmentService } from "@/src/domains/assignments/service";
import { StudentAssignment } from "@/src/domains/assignments/model";

type AssignmentSelectionPanelProps = {
  userId: string;
  onSelectAssignment: (assignmentCode: string) => void;
  onBackClick: () => void;
};

export function AssignmentSelectionPanel({
  userId,
  onSelectAssignment,
  onBackClick,
}: AssignmentSelectionPanelProps) {
  const [assignments, setAssignments] = useState<StudentAssignment[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentAssignments() {
      try {
        setLoading(true);
        const service = assignmentService(assignmentRepository(supabase));
        const assignmentsData = await service.getStudentAssignments(userId);

        setAssignments(assignmentsData);
        if (!assignmentsData || assignmentsData.length === 0) {
          setError("No assignments found. Please join an assignment first.");
        }
      } catch (err) {
        console.error("Error fetching student assignments:", err);
        setError("Failed to load your assignments");
      } finally {
        setLoading(false);
      }
    }

    fetchStudentAssignments();
  }, [userId]);

  if (loading) {
    return (
      <Card className="border-lime-100 shadow-sm">
        <CardContent className="p-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-lime-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-lime-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackClick}
            className="hover:bg-lime-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-xl text-lime-800">
            Your Assignments
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {error || !assignments || assignments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {error ||
                "No assignments found. Join an assignment to get started."}
            </p>
            <Button
              onClick={onBackClick}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              Join an Assignment
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-600">Select an assignment to work on:</p>

            <Separator className="my-2 bg-lime-100" />

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <Card
                  key={assignment.assignment_code}
                  className="border-lime-50 hover:border-lime-200 transition-colors cursor-pointer"
                  onClick={() => onSelectAssignment(assignment.assignment_code)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lime-800">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {assignment.due_date
                            ? `Due: ${new Date(
                                assignment.due_date
                              ).toLocaleDateString()}`
                            : "No due date"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-lime-700 hover:text-lime-800 hover:bg-lime-50"
                      >
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
