import PageFrame from "./PageFrame";
import { fetchDocumentContent } from "../../../utils/extractText";
import { Prompts } from "@/src/prompts";
import { useState } from "react";

import { Button } from "../../ui/button";
import {
  chatHistoryRepository,
  ChatHistoryRepository,
} from "@/src/domains/chat_history/repository";
import { supabase } from "@/lib/supabaseClient";
import { chatHistoryService } from "@/src/domains/chat_history/service";

import { assignmentRepository } from "@/src/domains/assignments/repository";
import { assignmentService } from "@/src/domains/assignments/service";
import { Assignment } from "@/src/domains/assignments/model";
type GradeWritingPanelProps = {
  userId: string;
  onBackClick: () => void;
  assignmentCode: string | null;
};

import appConfig from "@/app.config";
async function callOpenAI(userId: string, tool: string, prompt: any) {
  let responseFeedback = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appConfig.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        store: true,
      }),
    });

    const dataJson = await response.json();
    responseFeedback = dataJson.choices[0]?.message?.content || {
      score: "",
      rationale: "",
    };

    let feedback = JSON.parse(responseFeedback);

    const feedbackDictionary = {
      name: tool,
      feedback: feedback,
    };

    const newFeedbackService = chatHistoryService(
      chatHistoryRepository(supabase)
    );
    const { data, error } = await newFeedbackService.createChatHistory(
      userId,
      tool,
      JSON.stringify(feedbackDictionary)
    );
    return feedback;
  } catch (error) {
    console.error("Error:", error);
    return { score: "", rationale: "" };
  }
}

export function GradeWritingPanel({
  assignmentCode,
  userId,
  onBackClick,
}: GradeWritingPanelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [feedback, setFeedback] = useState<{
    current_draft: string[];
    previous_draft: string[];
  }>({
    current_draft: [],
    previous_draft: [],
  });

  useEffect(() => {
    async function fetchAssignmentDetails() {
      if (assignmentCode) {
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
          setError("Failed to load assignment details");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchAssignmentDetails();
  }, [assignmentCode]);

  async function handleGradeWriting() {
    const documentText = await fetchDocumentContent();
    const instructions = assignment?.instruction ? assignment?.instruction : "";
    const rubric = assignment?.rubric ? assignment?.rubric : "";
    const prompt = Prompts.GRADE_WRITING_PROMPT.format({
      currentDraft: documentText,
      instructions: instructions,
      rubric: rubric,
    });

    const gradeResult = await callOpenAI(userId, "grade", prompt);
    const score = gradeResult.score;
    const rationale = gradeResult.rationale;

    setFeedback((prev) => ({
      ...prev,
      current_draft: [documentText, score, rationale],
    }));
  }

  async function handleRegradeWriting() {
    const documentText = await fetchDocumentContent();
    const instructions = assignment?.instruction ? assignment?.instruction : "";
    const rubric = assignment?.rubric ? assignment?.rubric : "";
    const prompt = Prompts.REGRADE_WRITING_PROMPT.format({
      currentDraft: documentText,
      previousDraft: feedback.current_draft[0],
      previousFeedback: feedback.current_draft[2],
      instructions: instructions,
      rubric: rubric,
    });

    const gradeResult = await callOpenAI(userId, "grade", prompt);
    const score = gradeResult.score;
    const rationale = gradeResult.rationale;

    setFeedback((prev) => ({
      current_draft: [documentText, score, rationale],
      previous_draft: prev.current_draft,
    }));
  }

  return (
    <PageFrame onBackClick={onBackClick} title="What do you want to work on?">
      <Button
        className="w-full bg-lime-600 hover:bg-lime-700 text-white"
        onClick={
          feedback.current_draft.length === 0
            ? handleGradeWriting
            : handleRegradeWriting
        }
      >
        {feedback.current_draft.length === 0
          ? "Grade Writing"
          : "Re-grade Writing"}
      </Button>

      <div className="pt-7">
        {feedback.current_draft.length === 0 ? (
          <p className="text-base">
            Get an AI-generated score and feedback based on the assignment
            rubric from your teacher.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-gray-500 italic text-sm mt-1">
              <p>
                Disclaimer: This is an AI-generated response. It may contain
                mistakes. Please check the feedback carefully.
              </p>
            </div>
            <h3 className="font-bold mb-1 text-lg">
              Predicted Score: {feedback.current_draft[1]}
            </h3>

            <p className="text-base">{feedback.current_draft[2]}</p>
          </div>
        )}
      </div>
    </PageFrame>
  );
}
