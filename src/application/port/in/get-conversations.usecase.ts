import type { GetConversationsCommand } from '../../command/get-conversations.command';
import type { GetConversationsResult } from './result/get-conversations-result.dto';

export interface GetConversationsUseCase {
  execute(command: GetConversationsCommand): Promise<GetConversationsResult>;
}
