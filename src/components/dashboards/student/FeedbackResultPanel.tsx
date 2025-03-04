import PageFrame from "./PageFrame";
import FeedbackDisplay from "./FeedbackDisplay";

type FeedbackResultPanelProps = {
  feedback: Record<string, any>;
  onBackClick: () => void;
};

export function FeedbackResultPanel({
  feedback,
  onBackClick,
}: FeedbackResultPanelProps) {
  return (
    <PageFrame onBackClick={onBackClick} title="Feedback">
      <FeedbackDisplay feedback={feedback} />
    </PageFrame>
  );
}
