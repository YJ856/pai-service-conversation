import type { EndConversationCommand } from "src/application/command/end-conversation.command";
import type { EndConversationResponseResult } from "./result/end-conversation-result.dto";

export interface EndConversationUseCase {
  execute(command: EndConversationCommand): Promise<EndConversationResponseResult>;
}