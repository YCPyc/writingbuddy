import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { classService } from "@/src/domains/class/service";
import { classRepository } from "@/src/domains/class/repository";
import { supabase } from "@/lib/supabaseClient";
import { StudentToolsPage } from "./StudentToolsPage";
import { LogoutButton } from "../auth/LogoutButton";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import FeedbackCard from "../FeedbackCard";

type StudentDashboardProps = {
  userId: string;
};

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

  const feedbackButtons = [
    {
      title: "Thesis",
      copy: "Get advice about your thesis",
      prompt: "What makes a good thesis?",
    },
    {
      title: "Use of Evidence",
      copy: "Get feedback on the sources you used and the way you incorporated them.",
      prompt:
        "Did the writing use enough sources and are they described adequately?",
    },
    {
      title: "Analysis of Evidence",
      copy: "See how effectively your writing used evidence",
      prompt: "Did the paragraph effectively support its ideas with evidence?",
    },
    {
      title: "Paragraph Structure",
      copy: "Get tips about the structure of each paragraph",
      prompt: "Evaluate the structure of each paragraph.",
    },
    {
      title: "Grammar",
      copy: "Point out grammar errors",
      prompt: "Where are the grammar errors?",
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
        <Button onClick={joinClass} disabled={loading || !inputtedClassCode}>
          {loading ? "Joining..." : "Join Class"}
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
            prompt={item.prompt}
          />
        ))}
      </div>
    </div>
  );
}
