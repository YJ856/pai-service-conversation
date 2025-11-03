import type { Conversation } from '../../../domain/model/entity/conversation.entity';

/**
 * Conversation Query Port
 * 대화 조회를 위한 인터페이스
 */

export interface ConversationListItem {
  conversationId: bigint;
  startDate: string; // yyyy-MM-dd
  title: string | null;
  firstMediaId: bigint | null;
}

export interface GetConversationsParams {
  childProfileId: number;
  date?: string; // yyyy-MM-dd
  cursor?: { startDateYmd: string; conversationId: bigint };
  limit: number;
}

export interface ConversationQueryPort {
  /**
   * 대화 목록 조회 (갤러리)
   * @param params 조회 조건
   * @returns 대화 목록 (limit + 1개 조회하여 hasNext 판단)
   */
  findConversations(params: GetConversationsParams): Promise<ConversationListItem[]>;

  /**
   * 대화 상세 조회
   * @param conversationId 대화 ID
   * @returns 대화 전체 정보 (Question, Answer 포함)
   */
  findById(conversationId: bigint): Promise<Conversation | null>;
}
