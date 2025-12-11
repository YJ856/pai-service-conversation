/**
 * Media API Port
 * 미디어 일괄 삭제를 위한 외부 API 인터페이스
 */
export interface MediaApiPort {
  /**
   * 미디어 일괄 삭제
   * @param mediaIds 삭제할 미디어 ID 배열
   */
  batchDelete(mediaIds: bigint[]): Promise<void>;
}
