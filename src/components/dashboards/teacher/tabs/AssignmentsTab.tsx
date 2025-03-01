import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { assignmentService } from "@/src/domains/assignments/service";
import { assignmentRepository } from "@/src/domains/assignments/repository";
import { Assignment } from "@/src/domains/assignments/model";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";

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
  const [expandedInstructions, setExpandedInstructions] = useState<string[]>(
    []
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const service = assignmentService(assignmentRepository(supabase));
      const data = await service.getAssignments(classCode);

      // Sort assignments by due date (ascending)
      const sortedAssignments = [...data].sort((a, b) => {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });

      setAssignments(sortedAssignments);
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

  // Function to determine if due date is in the past
  const isDueDatePassed = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  // Toggle instruction expansion
  const toggleInstructionExpansion = (assignmentCode: string) => {
    setExpandedInstructions((prev) => {
      if (prev.includes(assignmentCode)) {
        return prev.filter((code) => code !== assignmentCode);
      } else {
        return [...prev, assignmentCode];
      }
    });
  };

  // Check if instruction is expanded
  const isInstructionExpanded = (assignmentCode: string) => {
    return expandedInstructions.includes(assignmentCode);
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Function to copy assignment code
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
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
          <div className="space-y-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.assignment_code}
                className="bg-card border rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">
                      {assignment.title}
                    </h3>
                    <Badge
                      variant={
                        isDueDatePassed(assignment.due_date)
                          ? "destructive"
                          : "outline"
                      }
                      className="flex items-center gap-1"
                    >
                      <CalendarIcon className="h-3 w-3" />
                      Due: {format(new Date(assignment.due_date), "PPP")}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3 flex items-center">
                    Created {format(new Date(assignment.created_at!), "PPP")}
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <code>{assignment.assignment_code}</code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1 p-0"
                              onClick={() =>
                                copyToClipboard(assignment.assignment_code)
                              }
                            >
                              {copiedCode === assignment.assignment_code ? (
                                <CheckIcon className="h-3 w-3 text-green-500" />
                              ) : (
                                <CopyIcon className="h-3 w-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedCode === assignment.assignment_code
                              ? "Copied!"
                              : "Copy assignment code"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Instructions</h4>
                    <div className="text-sm text-muted-foreground">
                      {isInstructionExpanded(assignment.assignment_code)
                        ? assignment.instruction
                        : truncateText(assignment.instruction)}
                    </div>

                    {assignment.instruction.length > 150 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 px-2 text-xs"
                        onClick={() =>
                          toggleInstructionExpansion(assignment.assignment_code)
                        }
                      >
                        {isInstructionExpanded(assignment.assignment_code) ? (
                          <>
                            <ChevronUpIcon className="h-4 w-4 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="h-4 w-4 mr-1" />
                            Read More
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-muted/30 px-4 py-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(assignment.assignment_code)}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
