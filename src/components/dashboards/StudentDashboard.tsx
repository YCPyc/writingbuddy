import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

import { classService } from "@/src/domains/class/service";
import { classRepository } from "@/src/domains/class/repository";
import FeedbackButton from "./student/FeedbackButton";
import FeedbackDisplay from "./student/FeedbackDisplay";
import { LogoutButton } from "../auth/LogoutButton";
import MainMenuOption from "./student/MainMenuOption";
import PageFrame from "./student/PageFrame";
import { Prompts } from "@/src/prompts";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../auth/AuthProvider";

type StudentDashboardProps = {
  userId: string;
};

export function StudentDashboard({ userId }: StudentDashboardProps) {
  const { id, email, role, classCode, setClassCode } = useAuth();
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
  const [enteredValidClassCode, setEnteredValidClassCode] = useState(false);

  const targetedFeedbackButtons = [
    {
      title: "Thesis",
      prompt: Prompts.THESIS_FEEDBACK_PROMPT,
    },
    {
      title: "Paragraph Structure",
      prompt: Prompts.PARAGRAPH_STRUCTURE_PROMPT,
    },
    {
      title: "Evidence",
      prompt: Prompts.EVIDENCE_USE_FEEDBACK_PROMPT,
    },
    {
      title: "Support",
      prompt: Prompts.SUPPORT_FEEDBACK_PROMPT,
    },
    {
      title: "Flow & Transitions",
      prompt: Prompts.TRANSITIONS_PROMPT,
    },
    {
      title: "Grammar",
      prompt: Prompts.GRAMMAR,
    },
  ];

  const stuckSupportButtons = [
    {
      title: "Can you help me plan?",
      prompt: Prompts.PREWRITING_PROMPT,
    },
    {
      title: "How can I get started writing?",
      prompt: Prompts.GETTING_STARTED_PROMPT,
    },
    {
      title: "What should I write next?",
      prompt: Prompts.CONTINUE_WRITING_PROMPT,
    },
    {
      title: "How should I finish?",
      prompt: Prompts.FINISH_WRITING_PROMPT,
    },
  ];

  // If student already has a class, show tools page
  if (classCode || showTools) {
    return <StudentToolsPage userId={userId} classCode={classCode || ""} />;
  }

  const joinClass = async () => {
    // TODO: Temporary pending database updates
    setEnteredValidClassCode(true);
    return;
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

  const handleBack = (source: string) => {
    if (source === "stuck") {
      setShowStuckOptions(false);
      setShowHelpOptions(true);
    } else if (source === "targeted") {
      setShowFeedbackOptions(false);
      setShowHelpOptions(true);
    } else if (source === "general") {
      setShowGeneralFeedbackOptions(false);
      setShowHelpOptions(true);
    } else {
      // For feedback page
      if (feedbackSource === "stuck") {
        setShowStuckOptions(true);
      } else if (feedbackSource === "targeted") {
        setShowFeedbackOptions(true);
      }
      setSelectedFeedback(null);
    }
  };

  return (
    <div className="student-panel p-4">
      <div className="header flex justify-end">
        <LogoutButton />
      </div>

      {enteredValidClassCode && showHelpOptions && (
        <div className="mt-6 gap-4 p-4">
          <h2 className="font-bold text-xl">What would you like help with?</h2>
          <Separator />
        </div>
      )}

      {!enteredValidClassCode && (
        <div className="join-class-form flex flex-wrap gap-4 p-4">
          <h2 className="font-bold text-xl">Join a Class</h2>
          <div className="form-group">
            <Label htmlFor="classCode">Class Code:</Label>
            <Input
              type="text"
              id="classCode"
              value={inputtedClassCode}
              onChange={(e) =>
                setInputtedClassCode(e.target.value.toUpperCase())
              }
              placeholder="Enter class code"
              required
            />
          </div>
          <Button onClick={joinClass} disabled={loading || !inputtedClassCode}>
            {loading ? "Joining..." : "Join Class"}
          </Button>
          {error && <div className="error">{error}</div>}{" "}
        </div>
      )}

      {enteredValidClassCode && (
        <>
          {showHelpOptions && (
            <div className="flex flex-wrap gap-4 p-4">
              <MainMenuOption
                buttonText="I'm Stuck"
                description="I'm not sure what I should do next and need help going on."
                onClick={() => {
                  setShowHelpOptions(false);
                  setShowStuckOptions(true);
                  setFeedbackSource("stuck");
                }}
              />
              <MainMenuOption
                buttonText="I Need Targeted Feedback"
                description="I want feedback on a specific part of my writing."
                onClick={() => {
                  setShowHelpOptions(false);
                  setShowFeedbackOptions(true);
                  setFeedbackSource("targeted");
                }}
              />
              <MainMenuOption
                buttonText="I Need General Feedback"
                description="Tell me in general how I can improve this writing so far."
                onClick={() => {
                  setShowHelpOptions(false);
                  setShowGeneralFeedbackOptions(true);
                }}
              />
            </div>
          )}

          {showStuckOptions && !selectedFeedback && (
            <PageFrame
              onBackClick={() => handleBack("stuck")}
              title="What are you stuck on?"
            >
              {stuckSupportButtons.map((item, index) => (
                <FeedbackButton
                  key={index}
                  tool="stuck"
                  userId={userId}
                  title={item.title}
                  prompt_template={item.prompt}
                  handleFeedback={handleFeedback}
                />
              ))}
            </PageFrame>
          )}

          {showFeedbackOptions && !selectedFeedback && (
            <PageFrame
              onBackClick={() => handleBack("targeted")}
              title="What feedback would you like?"
            >
              {targetedFeedbackButtons.map((item, index) => (
                <FeedbackButton
                  key={index}
                  tool="targeted"
                  userId={userId}
                  title={item.title}
                  prompt_template={item.prompt}
                  handleFeedback={handleFeedback}
                />
              ))}
            </PageFrame>
          )}

          {showGeneralFeedbackOptions && (
            <PageFrame
              onBackClick={() => handleBack("general")}
              title="What do you want to work on?"
            >
              <p>Chat-inteface-goes-here</p>
            </PageFrame>
          )}

          {selectedFeedback && (
            <>
              <PageFrame
                onBackClick={() => handleBack("feedback")}
                title="Feedback"
              >
                {/* Note: Need to adjust this to use stuck feedback later */}
                <FeedbackDisplay feedback={targetedFeedbackDictionary} />
              </PageFrame>
            </>
          )}
        </>
      )}
    </div>
  );
}
