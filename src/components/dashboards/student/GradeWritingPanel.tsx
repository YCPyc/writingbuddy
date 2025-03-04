import PageFrame from "./PageFrame";

type GradeWritingPanelProps = {
  onBackClick: () => void;
};

export function GradeWritingPanel({ onBackClick }: GradeWritingPanelProps) {
  return (
    <PageFrame onBackClick={onBackClick} title="What do you want to work on?">
      <div className="p-4 bg-white rounded-lg border border-lime-100 shadow-sm">
        <p className="text-center text-gray-500">Chat interface goes here</p>
      </div>
    </PageFrame>
  );
}
