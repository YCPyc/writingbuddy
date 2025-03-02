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
import { LogoutButton } from "../auth/LogoutButton";
import { Separator } from "../ui/separator";

import FeedbackCard from "./FeedbackCard";

type StudentDashboardProps = {
  userId: string;
};
import { THESIS_FEEDBACK_PROMPT } from "@/src/prompts/thesisPrompt";
import { EVIDENCE_USE_FEEDBACK_PROMPT } from "@/src/prompts/evidencePrompt";
import { SUPPORT_FEEDBACK_PROMPT } from "@/src/prompts/supportFeedbackPrompt";
import { PARAGRAPH_STRUCTURE_PROMPT } from "@/src/prompts/paragraphStructurePrompt";
import { GRAMMAR } from "@/src/prompts/grammarPrompt";

// Define a type for the feedback structure
type FeedbackDictionary = {
  [category: string]: {
    [subCategory: string]: string | string[];
  };
};

export function StudentDashboard({ userId }: StudentDashboardProps) {
  const [assignmentCode, setAssignmentCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [inputtedClassCode, setInputtedClassCode] = useState("");
  const [feedbackDictionary, setFeedbackDictionary] =
    useState<FeedbackDictionary>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasAssignment, setHasAssignment] = useState(false);
  const joinClass = () => {
    setIsLoading(true);
    setError(null);
    setHasAssignment(false);
  };

  const feedbackButtons = [
    {
      title: "Thesis",
      copy: "Check your essay's topic and focus",
      prompt: THESIS_FEEDBACK_PROMPT,
    },
    {
      title: "Use of Evidence",
      copy: "Check how well you incorporated sources",
      prompt: EVIDENCE_USE_FEEDBACK_PROMPT,
    },
    {
      title: "Support",
      copy: "Check that your ideas have adequate support details",
      prompt: SUPPORT_FEEDBACK_PROMPT,
    },
    {
      title: "Paragraph Structure",
      copy: "Check that your paragraphs have all the required parts",
      prompt: PARAGRAPH_STRUCTURE_PROMPT,
    },
    {
      title: "Grammar",
      copy: "Check for grammar mistakes",
      prompt: GRAMMAR,
    },
  ];

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

  const handleFeedback = ({ name, feedback }: any) => {
    const newFeedback = { [name]: feedback };
    setFeedbackDictionary((prev) => ({ ...prev, ...newFeedback }));
  };

  return (
    <div className="student-panel">
      <div className="header">
        <h2>Join a Class</h2>
        <LogoutButton />
      </div>
      <div className="join-class-form">
        <div className="form-group">
          <label htmlFor="classCode">Class Code:</label>
          <input
            type="text"
            id="classCode"
            value={inputtedClassCode}
            onChange={(e) => setInputtedClassCode(e.target.value.toUpperCase())}
            placeholder="Enter class code"
            required
          />
        </div>
        <Button onClick={joinClass} disabled={isLoading || !inputtedClassCode}>
          {isLoading ? "Joining..." : "Join Class"}
        </Button>
        {error && <div className="error">{error}</div>}{" "}
      </div>
      <div>
        <b>Targeted Feedback</b>
        <Separator />
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {feedbackButtons.map((item, index) => (
          <FeedbackCard
            title={item.title}
            copy={item.copy}
            prompt_template={item.prompt}
            handleFeedback={handleFeedback}
          />
        ))}
      </div>
      <div>
        {Object.keys(feedbackDictionary).length > 0 && (
          <>
            {Object.keys(feedbackDictionary).map((key) => (
              <div key={key} className="mb-5">
                <h2 className="font-bold mb-1 text-sm">{key}</h2>{" "}
                {/* Render the main key as a heading */}
                {Object.entries(feedbackDictionary[key]).map(
                  ([subKey, value]) => (
                    <div key={subKey} className="mb-5">
                      <h3 className="font-bold mb-0.5 text-xs">{subKey}</h3>
                      {Array.isArray(value) ? (
                        <ul className="list-disc pl-5">
                          {value.map((item, index) => (
                            <li key={index}>{item}</li> // List each item in "improvements"
                          ))}
                        </ul>
                      ) : (
                        <ul className="list-disc pl-5">
                          <li>{value}</li>
                        </ul>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
