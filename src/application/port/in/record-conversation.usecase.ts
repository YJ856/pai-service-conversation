import type { RecordConversationCommand } from 'src/application/command/record-conversation.command';
import type { RecordConversationResponseResult } from './result/record-conversation-result.dto';

export interface RecordConversationUseCase {
  execute(
    command: RecordConversationCommand,
  ): Promise<RecordConversationResponseResult>;
}
