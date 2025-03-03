import { THESIS_FEEDBACK_PROMPT } from "./targeted/thesisPrompt";
import { EVIDENCE_USE_FEEDBACK_PROMPT } from "./targeted/evidencePrompt";
import { SUPPORT_FEEDBACK_PROMPT } from "./targeted/supportFeedbackPrompt";
import { PARAGRAPH_STRUCTURE_PROMPT } from "./targeted/paragraphStructurePrompt";
import { GRAMMAR } from "./targeted/grammarPrompt";
import { TRANSITIONS_PROMPT } from "./targeted/transitionPrompt";
import { CONTINUE_WRITING_PROMPT } from "./stuck/continueWritingPrompt";
import { PREWRITING_PROMPT } from "./stuck/prewritingPrompt";
import { GETTING_STARTED_PROMPT } from "./stuck/getStartedPrompt";
import { FINISH_WRITING_PROMPT } from "./stuck/finishWritingPrompt";

export const Prompts = {
  // Stuck Support
  PREWRITING_PROMPT,
  CONTINUE_WRITING_PROMPT,
  GETTING_STARTED_PROMPT,
  FINISH_WRITING_PROMPT,
  // Targeted Feedback
  THESIS_FEEDBACK_PROMPT,
  EVIDENCE_USE_FEEDBACK_PROMPT,
  SUPPORT_FEEDBACK_PROMPT,
  PARAGRAPH_STRUCTURE_PROMPT,
  GRAMMAR,
  TRANSITIONS_PROMPT,
};
