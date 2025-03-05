import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { LogoutButton } from "../auth/LogoutButton";
import { JoinAssignmentForm } from "./student/JoinAssignmentForm";
import { StudentHeader } from "./student/StudentHeader";
import { HelpOptionsMenu } from "./student/HelpOptionsMenu";
import { StuckOptionsPanel } from "./student/StuckOptionsPanel";
import { TargetedFeedbackPanel } from "./student/TargetedFeedbackPanel";
import { GeneralFeedbackPanel } from "./student/GeneralFeedbackPanel";
import { GradeWritingPanel } from "./student/GradeWritingPanel";
import { FeedbackResultPanel } from "./student/FeedbackResultPanel";
import { AssignmentDetailsPanel } from "./student/AssignmentDetailsPanel";
import { AssignmentSelectionPanel } from "./student/AssignmentSelectionPanel";
import { Prompts } from "@/src/prompts";

type StudentDashboardProps = {
  userId: string;
};

export function StudentDashboard({ userId }: StudentDashboardProps) {
  const { classCode, setClassCode } = useAuth();
  const [targetedFeedbackDictionary, setTargetedFeedbackDictionary] = useState(
    {}
  );
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
  const [showHelpOptions, setShowHelpOptions] = useState(false);
  const [showAssignmentDetails, setShowAssignmentDetails] = useState(false);
  const [showAssignmentSelection, setShowAssignmentSelection] = useState(false);
  const [showStuckOptions, setShowStuckOptions] = useState(false);
  const [showGeneralFeedbackOptions, setShowGeneralFeedbackOptions] =
    useState(false);
  const [showGradeWriting, setShowGradeWriting] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [feedbackSource, setFeedbackSource] = useState<string | null>(null);
  const [enteredValidClassCode, setEnteredValidClassCode] = useState(false);
  const [selectedAssignmentCode, setSelectedAssignmentCode] = useState<
    string | null
  >(null);
  const [showJoinForm, setShowJoinForm] = useState(true);

  const targetedFeedbackButtons = [
    { title: "Thesis", prompt: Prompts.THESIS_FEEDBACK_PROMPT },
    {
      title: "Paragraph Structure",
      prompt: Prompts.PARAGRAPH_STRUCTURE_PROMPT,
    },
    { title: "Evidence", prompt: Prompts.EVIDENCE_USE_FEEDBACK_PROMPT },
    { title: "Support", prompt: Prompts.SUPPORT_FEEDBACK_PROMPT },
    { title: "Flow & Transitions", prompt: Prompts.TRANSITIONS_PROMPT },
    { title: "Grammar", prompt: Prompts.GRAMMAR },
  ];

  const stuckSupportButtons = [
    { title: "Can you help me plan?", prompt: Prompts.PREWRITING_PROMPT },
    {
      title: "How can I get started writing?",
      prompt: Prompts.GETTING_STARTED_PROMPT,
    },
    {
      title: "What should I write next?",
      prompt: Prompts.CONTINUE_WRITING_PROMPT,
    },
    { title: "How should I finish?", prompt: Prompts.FINISH_WRITING_PROMPT },
  ];

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
    } else if (source === "details") {
      setShowAssignmentDetails(false);
      setShowAssignmentSelection(true);
    } else if (source === "help") {
      setShowHelpOptions(false);
      setShowAssignmentDetails(true);
    } else if (source === "grade") {
      setShowGradeWriting(false);
      setShowHelpOptions(true);
    } else {
      // For feedback page
      if (feedbackSource === "stuck") {
        setSelectedFeedback(null);
        setShowStuckOptions(true);
      } else if (feedbackSource === "targeted") {
        setSelectedFeedback(null);
        setShowFeedbackOptions(true);
      }
    }
  };

  const handleJoinSuccess = () => {
    setEnteredValidClassCode(true);
    setShowAssignmentSelection(true);
    setShowJoinForm(false);
  };

  const handleSelectAssignment = (assignmentCode: string) => {
    console.log("handleSelectAssignment", assignmentCode);
    setSelectedAssignmentCode(assignmentCode);
    setShowAssignmentSelection(false);
    setShowAssignmentDetails(true);
  };

  const handleViewAssignmentDetails = () => {
    setShowAssignmentDetails(false);
    setShowHelpOptions(true);
  };

  const handleBackToJoinForm = () => {
    setShowAssignmentSelection(false);
    setShowJoinForm(true);
  };

  const handleViewExistingAssignments = () => {
    setShowJoinForm(false);
    setShowAssignmentSelection(true);
  };

  return (
    <div className="student-panel p-4 bg-gradient-to-b from-lime-50 to-white min-h-screen">
      <StudentHeader>
        <LogoutButton />
      </StudentHeader>

      <>
        {showJoinForm && (
          <JoinAssignmentForm
            userId={userId}
            setClassCode={setClassCode}
            onSuccess={handleJoinSuccess}
            onViewExistingAssignments={handleViewExistingAssignments}
          />
        )}
        {showAssignmentSelection && (
          <AssignmentSelectionPanel
            userId={userId}
            onSelectAssignment={handleSelectAssignment}
            onBackClick={handleBackToJoinForm}
          />
        )}

        {showAssignmentDetails && selectedAssignmentCode && (
          <AssignmentDetailsPanel
            assignmentCode={selectedAssignmentCode}
            onContinue={handleViewAssignmentDetails}
            onBackClick={() => handleBack("details")}
          />
        )}

        {showHelpOptions && (
          <HelpOptionsMenu
            onStuckClick={() => {
              setShowHelpOptions(false);
              setShowStuckOptions(true);
              setFeedbackSource("stuck");
            }}
            onTargetedFeedbackClick={() => {
              setShowHelpOptions(false);
              setShowFeedbackOptions(true);
              setFeedbackSource("targeted");
            }}
            onGeneralFeedbackClick={() => {
              setShowHelpOptions(false);
              setShowGeneralFeedbackOptions(true);
            }}
            onGradeWritingClick={() => {
              setShowHelpOptions(false);
              setShowGradeWriting(true);
            }}
            onBackClick={() => handleBack("help")}
          />
        )}

        {showStuckOptions && !selectedFeedback && (
          <StuckOptionsPanel
            buttons={stuckSupportButtons}
            userId={userId}
            onBackClick={() => handleBack("stuck")}
            handleFeedback={handleFeedback}
          />
        )}

        {showFeedbackOptions && !selectedFeedback && (
          <TargetedFeedbackPanel
            buttons={targetedFeedbackButtons}
            userId={userId}
            onBackClick={() => handleBack("targeted")}
            handleFeedback={handleFeedback}
          />
        )}

        {showGeneralFeedbackOptions && (
          <GeneralFeedbackPanel onBackClick={() => handleBack("general")} />
        )}

        {showGradeWriting && (
          <GradeWritingPanel
            assignmentCode={selectedAssignmentCode}
            userId={userId}
            onBackClick={() => handleBack("grade")}
          />
        )}

        {selectedFeedback && (
          <FeedbackResultPanel
            feedback={targetedFeedbackDictionary}
            onBackClick={() => handleBack("feedback")}
          />
        )}
      </>
    </div>
  );
}
