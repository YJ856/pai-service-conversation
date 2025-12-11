import type { Conversation } from '../../../domain/model/entity/conversation.entity';

export interface ConversationListItem {
  readonly conversationId: bigint;
  readonly startDate: string; // yyyy-MM-dd
  readonly title: string | null;
  readonly firstMediaId: bigint | null;
}

export interface GetConversationsParams {
  readonly childProfileId: number;
  readonly date?: string; // yyyy-MM-dd
  readonly cursor?: {
    readonly startDateYmd: string;
    readonly conversationId: bigint;
  };
  readonly limit: number;
}

export interface DailyChildCountRow {
  readonly date: string; // yyyy-MM-dd
  readonly childProfileId: number;
  readonly count: number;
}

export interface ConversationQueryPort {
  findConversations(
    params: GetConversationsParams,
  ): Promise<ConversationListItem[]>;

  findDetailConversationById(
    conversationId: bigint,
  ): Promise<Conversation | null>;

  getDailyConversationCounts(params: {
    year: number;
    month: number;
    childProfileIds: number[];
  }): Promise<DailyChildCountRow[]>;
}
