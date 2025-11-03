/**
 * Insights API Port
 * 키워드 목록으로부터 제목을 생성하는 외부 API 인터페이스
 */
export interface InsightsApiPort {
  /**
   * 키워드 목록으로부터 대화 제목을 생성
   * @param keywords 키워드 배열
   * @returns 생성된 제목
   */
  generateTitle(keywords: string[]): Promise<string>;
}
