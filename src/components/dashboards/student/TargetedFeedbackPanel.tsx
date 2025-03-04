import PageFrame from "./PageFrame";
import FeedbackButton from "./FeedbackButton";
import { PromptTemplate } from "@/src/prompts/basePrompt";
type TargetedFeedbackPanelProps = {
  buttons: Array<{ title: string; prompt: PromptTemplate }>;
  userId: string;
  onBackClick: () => void;
  handleFeedback: (data: any) => void;
};

export function TargetedFeedbackPanel({
  buttons,
  userId,
  onBackClick,
  handleFeedback,
}: TargetedFeedbackPanelProps) {
  return (
    <PageFrame onBackClick={onBackClick} title="What feedback would you like?">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buttons.map((item, index) => (
          <FeedbackButton
            key={index}
            tool="targeted"
            userId={userId}
            title={item.title}
            prompt_template={item.prompt}
            handleFeedback={handleFeedback}
          />
        ))}
      </div>
    </PageFrame>
  );
}
