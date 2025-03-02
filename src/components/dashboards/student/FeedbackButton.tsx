import appConfig from "@/app.config";
import { fetchDocumentContent } from "../../../utils/extractText";
import { Button } from "../../ui/button";
import { createClient } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";
import {
  chatHistoryRepository,
  ChatHistoryRepository,
} from "@/src/domains/chat_history/repository";
import { chatHistoryService } from "@/src/domains/chat_history/service";
function FeedbackButton({
  title,
  tool,
  userId,
  prompt_template,
  handleFeedback,
}: any) {
  const [feedback, setFeedback] = useState();
  const handleClick = async () => {
    // Extract all document content
    const documentText = await fetchDocumentContent();

    // Put document into prompt
    const prompt = prompt_template.format({ exemplar: documentText });

    let responseFeedback = "";

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${appConfig.openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            store: true,
          }),
        }
      );

      const dataJson = await response.json();
      responseFeedback = dataJson.choices[0]?.message?.content || "No response";

      let feedback: Record<string, string> | string;
      if (tool == "targeted") {
        feedback = JSON.parse(responseFeedback);
      } else {
        // Stuck
        feedback = responseFeedback;
      }

      const feedbackDictionary = {
        name: title,
        feedback: feedback,
      };

      handleFeedback(feedbackDictionary);

      const newFeedbackService = chatHistoryService(
        chatHistoryRepository(supabase)
      );
      const { data, error } = await newFeedbackService.createChatHistory(
        userId,
        title,
        feedback
      );
    } catch (error) {
      console.error("Error:", error);
      responseFeedback = "Error fetching classification";
    }
  };

  return (
    <Button key={title} className="text-base" onClick={handleClick}>
      {title}
    </Button>
  );
}

export default FeedbackButton;
