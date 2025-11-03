import type { GetConversationDetailCommand } from '../../command/get-conversation-detail.command';
import type { GetConversationDetailResult } from './result/get-conversation-detail-result.dto';

export interface GetConversationDetailUseCase {
  execute(command: GetConversationDetailCommand): Promise<GetConversationDetailResult>;
}
