import appConfig from "@/app.config";
import { fetchDocumentContent } from "../../../utils/extractText";
import { Button } from "../../ui/button";
import { createClient } from "@supabase/supabase-js";

function FeedbackCard({ title, tool, prompt_template, handleFeedback }: any) {
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

      const data = await response.json();
      responseFeedback = data.choices[0]?.message?.content || "No response";

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

      const supabase = createClient(
        appConfig.supabaseUrl,
        appConfig.supabaseKey
      );
      const createChatHistory = async () => {
        const { data, error } = await supabase.from("chat_history").insert([
          {
            tool_name: title,
            messages: [feedbackDictionary],
            student_id: "4fabc89c-ded5-4f14-b9d2-7e25bfe361ac",
          },
        ]);
      };

      // Call the function
      createChatHistory();
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

export default FeedbackCard;
