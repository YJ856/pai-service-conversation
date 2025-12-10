import type { Conversation } from '../../../domain/model/entity/conversation.entity';

/**
 * Session Repository Port
 * Redis에 임시로 대화 세션을 저장/조회/삭제하는 인터페이스
 */
export interface SessionRepositoryPort {
  /**
   * 세션 ID로 대화를 조회
   * @param sessionId 세션 ID
   * @returns 저장된 Conversation 또는 null
   */
  load(sessionId: string): Promise<Conversation | null>;

  /**
   * 세션 ID로 대화를 저장 (TTL: 24시간)
   * @param sessionId 세션 ID
   * @param conversation 저장할 Conversation
   */
  save(sessionId: string, conversation: Conversation): Promise<void>;

  /**
   * 세션 ID로 대화를 삭제
   * @param sessionId 세션 ID
   */
  delete(sessionId: string): Promise<void>;
}
