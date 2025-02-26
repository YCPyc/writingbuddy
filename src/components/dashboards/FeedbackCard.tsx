import appConfig from "@/app.config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { fetchDocumentContent } from "../../utils/extractText";
import { Button } from "../ui/button";
function FeedbackCard({ title, prompt_template, handleFeedback }: any) {
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
      const feedbackDictionary: Record<string, string> =
        JSON.parse(responseFeedback);
      handleFeedback({
        name: title,
        feedback: feedbackDictionary,
      });
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
