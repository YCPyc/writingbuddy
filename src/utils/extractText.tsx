import { supabase } from "@/lib/supabaseClient";
const authenticateAndExtractText = async (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) {
      reject(
        "Error getting session: " + (error?.message || "No session received.")
      );
      return;
    }
    const token = localStorage.getItem("google_access_token");

    if (!token) {
      reject("No token received.");
      return;
    }

    extractTextFromGoogleDoc(token).then(resolve).catch(reject);
  });
};

const getDocumentIdFromUrl = () => {
  return new Promise<string>((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url;
      const match = url?.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
      const documentId = match ? match[1] : null;

      if (documentId) {
        resolve(documentId); // Resolve the Promise with the document ID
      } else {
        reject("Not a valid Google Doc URL");
      }
    });
  });
};

const extractTextFromGoogleDoc = async (token: string): Promise<string> => {
  const documentId = await getDocumentIdFromUrl(); // Extract the document ID

  return fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Extract text from document body
      const bodyContent = data.body.content;
      let allText = "";

      bodyContent.forEach((element: any) => {
        if (element.paragraph) {
          element.paragraph.elements.forEach((textElement: any) => {
            if (textElement.textRun && textElement.textRun.content) {
              allText += textElement.textRun.content;
            }
          });
        }
      });

      return allText; // Return the extracted text
    })
    .catch((error) => {
      throw new Error("Error extracting text: " + error);
    });
};

// Call the function and handle the result in your other component
export const fetchDocumentContent = async () => {
  try {
    const documentText = await authenticateAndExtractText();
    console.log("Document Text:", documentText); // Use the extracted text here
    return documentText; // You can return it for further use
  } catch (error) {
    console.error("Error:", error.message);
    return ""; // Return empty string in case of error
  }
};
