import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { classService } from "@/src/domains/class/service";
import { classRepository } from "@/src/domains/class/repository";
import { supabase } from "@/lib/supabaseClient";
import { StudentToolsPage } from "./StudentToolsPage";
import { LogoutButton } from "../auth/LogoutButton";
import { Button } from "../ui/button";
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
import { TRANSITIONS_PROMPT } from "@/src/prompts/transitionPrompt";
import GoBackButton from "./GoBackButton";

export function StudentDashboard({ userId }: StudentDashboardProps) {
  const {
    id,
    email,
    role,
    classCode,
    setRole,
    setClassCode,
    signInWithGoogle,
    signOut,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [inputtedClassCode, setInputtedClassCode] = useState("");
  const [targetedFeedbackDictionary, setTargetedFeedbackDictionary] = useState(
    {}
  );
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
  const [showHelpOptions, setShowHelpOptions] = useState(true);
  const [showStuckOptions, setShowStuckOptions] = useState(false);
  const [showGeneralFeedbackOptions, setShowGeneralFeedbackOptions] =
    useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [feedbackSource, setFeedbackSource] = useState<string | null>(null);

  const targetedFeedbackButtons = [
    {
      title: "Thesis",
      prompt: THESIS_FEEDBACK_PROMPT,
    },
    {
      title: "Paragraph Structure",
      prompt: PARAGRAPH_STRUCTURE_PROMPT,
    },
    {
      title: "Evidence",
      prompt: EVIDENCE_USE_FEEDBACK_PROMPT,
    },
    {
      title: "Support",
      prompt: SUPPORT_FEEDBACK_PROMPT,
    },
    {
      title: "Flow & Transitions",
      prompt: TRANSITIONS_PROMPT,
    },
    {
      title: "Grammar",
      prompt: GRAMMAR,
    },
  ];

  const stuckSupportButtons = [
    {
      title: "Brainstorming",
      prompt: THESIS_FEEDBACK_PROMPT,
    },
    {
      title: "temp",
      prompt: PARAGRAPH_STRUCTURE_PROMPT,
    },
    {
      title: "temp",
      prompt: EVIDENCE_USE_FEEDBACK_PROMPT,
    },
    {
      title: "temp",
      prompt: SUPPORT_FEEDBACK_PROMPT,
    },
  ];

  // If student already has a class, show tools page
  if (classCode || showTools) {
    return <StudentToolsPage userId={userId} classCode={classCode || ""} />;
  }

  const joinClass = async () => {
    try {
      setLoading(true);
      const newClassService = classService(classRepository(supabase));
      const { error } = await newClassService.joinClass(
        inputtedClassCode,
        userId
      );

      if (error) {
        setError("Invalid class code or failed to join class");
        throw error;
      }
      setClassCode(inputtedClassCode);
      setShowTools(true);
    } catch (error) {
      console.error("Error joining class:", error);
      setError("Failed to join class");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = ({ name, feedback }: any) => {
    const newFeedback = { [name]: feedback };
    setTargetedFeedbackDictionary((prev) => ({ ...prev, ...newFeedback }));
    setSelectedFeedback(name);
    setShowFeedbackOptions(false);
  };

  return (
    <div className="student-panel p-4">
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
        <Button onClick={joinClass} disabled={loading || !inputtedClassCode}>
          {loading ? "Joining..." : "Join Class"}
        </Button>
        {error && <div className="error">{error}</div>}{" "}
      </div>

      {showHelpOptions && (
        <div className="flex flex-wrap gap-4 p-4">
          <Button
            className="w-full text-base"
            onClick={() => {
              setShowHelpOptions(false);
              setShowStuckOptions(true);
              setFeedbackSource("stuck");
            }}
          >
            I'm Stuck
          </Button>
          <p className="text-sm text-gray-600 mb-2">
            I'm not sure what I should do next and need help going on.
          </p>
          <Button
            className="w-full text-base"
            onClick={() => {
              setShowHelpOptions(false);
              setShowFeedbackOptions(true);
              setFeedbackSource("targeted");
            }}
          >
            I Need Targeted Feedback
          </Button>
          <p className="text-sm text-gray-600 mb-2">
            I want feedback on a specific part of my writing.
          </p>
          <Button
            className="w-full text-base"
            onClick={() => {
              setShowHelpOptions(false);
              setShowGeneralFeedbackOptions(true);
            }}
          >
            I Need General Feedback
          </Button>
          <p className="text-sm text-gray-600 mb-2">
            Tell me in general how I can improve this writing so far.
          </p>
        </div>
      )}

      {showStuckOptions && !selectedFeedback && (
        <div className="flex flex-wrap gap-4 p-4">
          <GoBackButton
            onClick={() => {
              setShowStuckOptions(false);
              setShowHelpOptions(true);
            }}
          />
          <h2 className="font-bold text-xl">How can I help?</h2>
          <Separator />
          {stuckSupportButtons.map((item, index) => (
            <FeedbackCard
              key={index}
              title={item.title}
              prompt_template={item.prompt}
              handleFeedback={handleFeedback}
            />
          ))}
        </div>
      )}

      {showFeedbackOptions && !selectedFeedback && (
        <div className="flex flex-wrap gap-4 p-4">
          <GoBackButton
            onClick={() => {
              setShowFeedbackOptions(false);
              setShowHelpOptions(true);
            }}
          />
          {targetedFeedbackButtons.map((item, index) => (
            <FeedbackCard
              key={index}
              title={item.title}
              prompt_template={item.prompt}
              handleFeedback={handleFeedback}
            />
          ))}
        </div>
      )}

      {showGeneralFeedbackOptions && (
        <div className="flex flex-wrap gap-4 p-4">
          <GoBackButton
            onClick={() => {
              setShowGeneralFeedbackOptions(false);
              setShowHelpOptions(true);
            }}
          />
          <h2 className="font-bold text-xl">What would you like help with?</h2>
          <Separator />
        </div>
      )}

      {selectedFeedback && (
        <div className="flex flex-col gap-4 p-4">
          <GoBackButton
            onClick={() => {
              if (feedbackSource === "stuck") {
                setShowStuckOptions(true);
              } else if (feedbackSource === "targeted") {
                setShowFeedbackOptions(true);
              }
              setSelectedFeedback(null);
            }}
          />
          <h2 className="font-bold text-xl">{selectedFeedback} Feedback</h2>
          <Separator />
          <div>
            <div className="text-gray-500 italic text-sm mt-1">
              <p>Disclaimer: This is an AI-generated response.</p>
            </div>
          </div>
          <div>
            {Object.keys(targetedFeedbackDictionary).length > 0 && (
              <>
                {Object.keys(targetedFeedbackDictionary).map((key) => (
                  <div key={key} className="mb-5">
                    <h2 className="font-bold mb-1 text-sm">{key}</h2>{" "}
                    {Object.entries(targetedFeedbackDictionary[key]).map(
                      ([subKey, value]) => (
                        <div key={subKey} className="mb-5">
                          <h3 className="font-bold mb-0.5 text-xs">{subKey}</h3>
                          {Array.isArray(value) ? (
                            <ul className="list-disc pl-5">
                              {value.map((item, index) => (
                                <li key={index}>{item}</li>
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
      )}
    </div>
  );
}
