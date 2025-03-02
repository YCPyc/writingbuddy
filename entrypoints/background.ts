import { browser } from "wxt/browser";
import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { z } from 'zod'
import appConfig from '../app.config'
// Add your OpenAI API key


export default defineBackground(() => {
  // @ts-ignore
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: any) => console.error(error));

     // Core message listener for new chat requests
     browser.runtime.onMessage.addListener(async (request: any) => {
      if (request.type === 'chat_request') {
        return handleChatRequest(request.messages)
      }
      
      return false
    })
    
    // Store active chat sessions and their states
    const chatSessions = new Map();
    
    // Define API key directly (for testing only - in production use secure methods)
    
    // Handle new chat requests
    async function handleChatRequest(messages: any[]) {
      try {
        // Create a unique ID for this chat session
        const chatId = Date.now().toString()
        console.log("handleChatRequest", messages)
    
      // Create OpenAI client with API key
    const openaiClient = createOpenAI({
      apiKey: appConfig.openaiApiKey,
    });
    
        // Create a stream using the AI SDK with API key
        const stream = streamText({
          model: openaiClient('gpt-4o-mini'),
          messages,
        })
        console.log("stream", stream)
        
        // Process the stream and send chunks to the UI
        processAndSendStream(stream)
        
        return { success: true, chatId }
      } catch (error) {
        console.error('Chat processing error:', error)
        // Send error back to UI
        sendMessage({
          type: 'chat_error',
          error: errorHandler(error)
        })
        
        return { success: false, error: errorHandler(error) }
      }
    }
    
    // Process and send stream chunks to UI
    async function processAndSendStream(stream: any) {
      try {
        // Get the readable stream from the AI SDK
        const readable = stream.toDataStream({
          getErrorMessage: errorHandler
        })
        
        const reader = readable.getReader()
        
        // Read and forward stream chunks
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          // Convert the Uint8Array to a string
          const text = new TextDecoder().decode(value);
          console.log("Decoded text:", text);
          
          // Send the text directly to your extension's UI components
          sendMessage({
            type: 'chat_chunk',
            chunk: text
          })
        }
        
        console.log(`Stream completed for chat`)
      } catch (error) {
        console.error('Stream processing error:', error)
        sendMessage({
          type: 'chat_error',
          error: errorHandler(error),
        })
      }
    }
    
    
    // Helper to send messages to UI or specific tab
    function sendMessage(message:any) {
      // Send to extension UI components
      browser.runtime.sendMessage(message).catch(err => {
        console.warn('Could not send runtime message:', err)
      })
      
    }
    
    // Error handler
    function errorHandler(error: any) {
      if (error == null) {
        return 'unknown error'
      }
      
      if (typeof error === 'string') {
        return error
      }
      
      if (error instanceof Error) {
        return error.message
      }
      
      return JSON.stringify(error)
    }

});
