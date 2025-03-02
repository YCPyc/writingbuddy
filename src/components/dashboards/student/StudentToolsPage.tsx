import { LogoutButton } from "../../auth/LogoutButton";
import ProvidedFeedbackOnSelection from "@/src/components/dashboards/student/ProvideFeedbackOnSelection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

type StudentToolsPageProps = {
  userId: string;
  assignmentCode: string;
};

export function StudentToolsPage({
  userId,
  assignmentCode,
}: StudentToolsPageProps) {
  const [feedback, setFeedback] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");

  const handleAddFeedback = (feedback: string) => {
    setFeedback(feedback);
  };

  const handleAddSelectedText = (selectedText: string) => {
    setSelectedText(selectedText);
  };

  return (
    <div className="student-tools-page">
      <div className="header">
        <h2>Student Tools</h2>
        <LogoutButton />
      </div>
      <p>Assignment Code: {assignmentCode}</p>

      <ProvidedFeedbackOnSelection
        addFeedback={handleAddFeedback}
        getSelectedText={handleAddSelectedText}
      />

      {selectedText ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{selectedText}</AccordionTrigger>
            <AccordionContent>{feedback}</AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <></>
      )}
    </div>
  );
}
