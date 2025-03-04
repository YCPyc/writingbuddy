import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Alert, AlertDescription } from "../../ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { classService } from "@/src/domains/class/service";
import { classRepository } from "@/src/domains/class/repository";
import { supabase } from "@/lib/supabaseClient";

type JoinAssignmentFormProps = {
  userId: string;
  setClassCode: (code: string) => void;
  onSuccess: () => void;
  onViewExistingAssignments: () => void;
};

export function JoinAssignmentForm({
  userId,
  setClassCode,
  onSuccess,
  onViewExistingAssignments,
}: JoinAssignmentFormProps) {
  const [inputtedClassCode, setInputtedClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinAssignment = async () => {
    if (!inputtedClassCode) {
      setError("Please enter an assignment code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = classService(classRepository(supabase));
      const result = await service.joinAssignment(inputtedClassCode, userId);

      if (result.error) {
        setError(result.error);
      } else {
        setClassCode(inputtedClassCode);
        onSuccess();
      }
    } catch (err) {
      console.error("Error joining assignment:", err);
      setError("Failed to join assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-lime-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-lime-800">Join Assignment</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="classCode">Assignment Code</Label>
          <Input
            id="classCode"
            placeholder="Enter assignment code"
            value={inputtedClassCode}
            onChange={(e) => setInputtedClassCode(e.target.value)}
          />
        </div>

        <Button
          onClick={joinAssignment}
          disabled={loading || !inputtedClassCode}
          className="w-full bg-lime-600 hover:bg-lime-700 text-white"
        >
          {loading ? "Joining..." : "Join Assignment"}
        </Button>

        <div className="text-center pt-2">
          <Button
            variant="link"
            onClick={onViewExistingAssignments}
            className="text-lime-700 hover:text-lime-800"
          >
            View My Existing Assignments
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
