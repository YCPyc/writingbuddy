import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { assignmentRepository } from "@/src/domains/assignments/repository";
import { assignmentService } from "@/src/domains/assignments/service";
import { Assignment } from "@/src/domains/assignments/model";

type AssignmentDetailsPanelProps = {
  assignmentCode: string;
  onContinue: () => void;
  onBackClick: () => void;
};

export function AssignmentDetailsPanel({
  assignmentCode,
  onContinue,
  onBackClick,
}: AssignmentDetailsPanelProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignmentDetails() {
      console.log("fetchAssignmentDetails", assignmentCode);
      try {
        setLoading(true);
        const service = assignmentService(assignmentRepository(supabase));
        const assignmentData = await service.getAssignmentDetails(
          assignmentCode
        );

        if (assignmentData) {
          setAssignment(assignmentData);
        } else {
          setError("Could not find assignment details");
        }
      } catch (err) {
        console.error("Error fetching assignment details:", err);
        setError("Failed to load assignment details");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignmentDetails();
  }, [assignmentCode]);

  if (loading) {
    return (
      <Card className="border-lime-100 shadow-sm">
        <CardContent className="p-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-lime-600" />
        </CardContent>
      </Card>
    );
  }

  if (error || !assignment) {
    return (
      <Card className="border-lime-100 shadow-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <p className="text-red-500">{error || "Assignment not found"}</p>
            <Button
              onClick={onBackClick}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              Back to Assignments
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-lime-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl text-lime-800">
            Assignment Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{assignment.title}</h3>
          <p className="text-sm text-gray-500">
            Due:{" "}
            {assignment.due_date
              ? new Date(assignment.due_date).toLocaleDateString()
              : "No due date"}
          </p>
        </div>

        <Separator className="my-2 bg-lime-100" />

        <div className="space-y-3 text-base">
          <div>
            <h4 className="font-medium text-lime-800 text-lg">Instructions</h4>
            <p className="whitespace-pre-line text-gray-700">
              {assignment.instruction}
            </p>
          </div>

          {assignment.rubric && (
            <div>
              <h4 className="font-medium text-lime-800 mt-8 text-lg">Rubric</h4>
              <p className="whitespace-pre-line text-gray-700">
                {assignment.rubric}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
