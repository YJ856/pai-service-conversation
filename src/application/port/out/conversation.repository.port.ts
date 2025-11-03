import type { Conversation } from '../../../domain/model/entity/conversation.entity';

/**
 * Conversation Repository Port
 * DB에 대화를 영구 저장하는 인터페이스
 */
export interface ConversationRepositoryPort {
  /**
   * 대화를 DB에 저장
   * @param conversation 저장할 Conversation (title 포함)
   * @returns 저장된 Conversation (ID 포함)
   */
  save(conversation: Conversation): Promise<Conversation>;
}
