const authenticateAndExtractText = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject("Error getting auth token: " + chrome.runtime.lastError.message);
        return;
      }

      if (!token) {
        reject("No token received.");
        return;
      }
      extractTextFromGoogleDoc(token).then(resolve).catch(reject);
    });
  });
};

const refreshTokenIfExpired = () => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      if (chrome.runtime.lastError || !token) {
        chrome.identity.getAuthToken(
          { interactive: true },
          function (newToken) {
            if (chrome.runtime.lastError || !newToken) {
              reject(
                "Error refreshing auth token: " + chrome.runtime.lastError
              );
            } else {
              resolve(newToken);
            }
          }
        );
      } else {
        resolve(token);
      }
    });
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

  return refreshTokenIfExpired()
    .then((token) => {
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
    })
    .catch((error) => {
      throw new Error("Failed to authenticate or refresh token: " + error);
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
