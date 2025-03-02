import { ChatHistoryRepository } from "./repository";
export function chatHistoryService(
  chatHistoryRepository: ChatHistoryRepository
) {
  return {
    createChatHistory: chatHistoryRepository.createChatHistory,
  };
}
