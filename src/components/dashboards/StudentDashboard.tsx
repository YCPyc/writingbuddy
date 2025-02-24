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

      <div className="flex flex-wrap gap-4 p-4">
        <Button className="w-full text-base">I'm Stuck</Button>
        <p className="text-sm text-gray-600 mb-2">
          I'm not sure what I should do next and need help going on.
        </p>
        <Button className="w-full text-base">I Need Targeted Feedback</Button>
        <p className="text-sm text-gray-600 mb-2">
          I want feedback on a specific part of my writing.
        </p>
        <Button className="w-full text-base">I Need General Feedback</Button>
        <p className="text-sm text-gray-600 mb-2">
          Tell me in general how I can improve this writing so far.
        </p>
      </div>

      <div>
        <h2 className="font-bold text-xl">What do you need help with?</h2>
        <Separator />
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {targetedFeedbackButtons.map((item, index) => (
          <FeedbackCard
            title={item.title}
            prompt_template={item.prompt}
            handleFeedback={handleFeedback}
          />
        ))}
      </div>
      <div>
        {Object.keys(targetedFeedbackDictionary).length > 0 && (
          <>
            {Object.keys(targetedFeedbackDictionary).map((key) => (
              <div key={key} className="mb-5">
                <h2 className="font-bold mb-1 text-sm">{key}</h2>{" "}
                {/* Render the main key as a heading */}
                {Object.entries(targetedFeedbackDictionary[key]).map(
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
