import { Button } from "./ui/button";
import appConfig from "@/app.config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
// prompt: list of dictionaries

/*
1. Click button
2. Run document scraping function
3. Process document content
4. Build context
5. Send LLM
6. Send back result
*/

function FeedbackCard({ title, copy, prompt }: any) {
  const handleClick = async () => {
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
            messages: prompt,
            store: true,
          }),
        }
      );

      const data = await response.json();
      responseFeedback = data.choices[0]?.message?.content || "No response";
    } catch (error) {
      console.error("Error:", error);
      responseFeedback = "Error fetching classification";
    }
  };

  return (
    <>
      <Card key={title} className="h-full" onClick={handleClick}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>{copy}</CardContent>
      </Card>
    </>
  );
}

export default FeedbackCard;
