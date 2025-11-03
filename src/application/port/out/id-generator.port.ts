/**
 * ID Generator Port
 * 새로운 세션 ID를 생성하는 인터페이스
 */
export interface IdGeneratorPort {
  /**
   * 새로운 세션 ID 생성
   * @returns 고유한 세션 ID (UUID 형식)
   */
  newSessionId(): string;
}
