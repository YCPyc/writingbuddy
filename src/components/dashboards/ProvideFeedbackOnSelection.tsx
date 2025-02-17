import appConfig from "@@/app.config";
import { Button } from "../ui/button";

function ProvidedFeedbackOnSelection({ addFeedback, getSelectedText }: any) {
  const [text, setText] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const handleClick = async () => {
    // Get the text the user highlighted
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;

      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            const iframe = document.querySelector(
              "iframe.docs-texteventtarget-iframe"
            ) as HTMLIFrameElement | null;

            if (!iframe) return "";

            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow?.document;
            return iframeDoc?.getSelection()?.toString() || "";
          },
        })
        .then((results) => {
          const selectedText = results?.[0]?.result as string;
          if (selectedText) {
            setText(selectedText);
          } else {
            setText("No text selected or selection not detected.");
          }
        })
        .catch((error) => console.error("Error executing script:", error));
    });
  };

  // Trigger LLM when text is updated
  useEffect(() => {
    if (text) {
      const fetchLLMResponse = async () => {
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
                messages: [
                  {
                    role: "system",
                    content:
                      "You are a writing instructor who is evaluating a sentence for grammatical mistakes related to verbs, including conjugation, agreement, or omission issues.  Instead of fixing the student's sentence, you provide feedback to the user in the form of a reflective question.",
                  },
                  {
                    role: "user",
                    content: `Review the following sentence's verb tenses.

                    Example:
                    Sentence: I likes cat.
                    Feedback: Does "likes" match "I"?

                    Sentence: When they get off work, most employees are go on the busy subway.
                    Feedback: Good description!  Could you look at 'go' again?

                    Sentence: ${text}
                    Feedback:`,
                  },
                ],
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

        // Once the response is fetched, set the feedback
        setFeedback(responseFeedback);
        addFeedback(responseFeedback);
        getSelectedText(text);
      };

      // Call the function to fetch LLM response when text is updated
      fetchLLMResponse();
    }
  }, [text]);

  return (
    <div>
      <Button onClick={handleClick}>Evaluate Selected Text</Button>
    </div>
  );
}

export default ProvidedFeedbackOnSelection;
