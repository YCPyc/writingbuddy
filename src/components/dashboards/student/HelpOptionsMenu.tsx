import { Separator } from "../../ui/separator";
import MainMenuOption from "./MainMenuOption";
import { Button } from "../../ui/button";
import { ChevronLeft } from "lucide-react";

type HelpOptionsMenuProps = {
  onStuckClick: () => void;
  onTargetedFeedbackClick: () => void;
  onGeneralFeedbackClick: () => void;
  onGradeWritingClick: () => void;
  onBackClick: () => void;
};

export function HelpOptionsMenu({
  onStuckClick,
  onTargetedFeedbackClick,
  onGeneralFeedbackClick,
  onGradeWritingClick,
  onBackClick,
}: HelpOptionsMenuProps) {
  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="hover:bg-lime-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-bold text-xl text-lime-800">
          What would you like help with?
        </h2>
      </div>
      <Separator className="my-4 bg-lime-200" />

      <div className="flex flex-col max-w-md gap-4">
        <MainMenuOption
          buttonText="I'm Stuck"
          description="I'm not sure what I should do next and need help going on."
          onClick={onStuckClick}
        />
        <MainMenuOption
          buttonText="I Need Targeted Feedback"
          description="I want feedback on a specific part of my writing."
          onClick={onTargetedFeedbackClick}
        />

        <MainMenuOption
          buttonText="Grade My Writing"
          description="I want AI to provide a grade with the assignment rubric."
          onClick={onGradeWritingClick}
        />
      </div>
    </div>
  );
}
