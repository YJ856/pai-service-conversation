import type { Conversation } from '../../../domain/model/entity/conversation.entity';


export interface ConversationListItem {
  conversationId: bigint;
  startDate: string; // yyyy-MM-dd
  title: string | null;
  firstMediaId: bigint | null;
}

export interface GetConversationsParams {
  childProfileId: number;
  date?: string; // yyyy-MM-dd
  cursor?: { startDateYmd: string, conversationId: bigint };
  limit: number;
}

export interface ConversationQueryPort {

  findConversations(params: GetConversationsParams): Promise<ConversationListItem[]>;

  findDetailConversationById(conversationId: bigint): Promise<Conversation | null>;
}
