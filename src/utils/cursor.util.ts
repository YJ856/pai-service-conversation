/**
 * 커서 기반 페이지네이션 유틸리티
 */

/**
 * 복합 커서 디코딩 (날짜 + ID)
 * Base64("yyyy-MM-dd|conversationId") → { startDateYmd, conversationId } | null
 * 예: "MjAyNS0xMS0wM3wxMjM0NQ==" → { startDateYmd: "2025-11-03", conversationId: 12345n }
 */
export function decodeCompositeCursor(
  cursor: string | null
): { startDateYmd: string; conversationId: bigint } | null {
  if (!cursor) return null;
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf8');
    const raw = safeJsonParse(decoded);
    const s = typeof raw === 'string' ? raw : decoded;
    const [ymd, idStr] = String(s).split('|');

    // 날짜 형식 검증
    if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
    if (!idStr || !/^\d+$/.test(idStr)) return null;

    const conversationId = BigInt(idStr);
    if (conversationId <= 0n) return null;

    return { startDateYmd: ymd, conversationId };
  } catch {
    return null;
  }
}

/**
 * 복합 커서 인코딩 (날짜 + ID)
 * { startDateYmd, conversationId } → Base64("yyyy-MM-dd|conversationId")
 * 예: { startDateYmd: "2025-11-03", conversationId: 12345n } → "MjAyNS0xMS0wM3wxMjM0NQ=="
 */
export function encodeCompositeCursor(
  startDateYmd: string,
  conversationId: bigint | number
): string {
  const payload = JSON.stringify(`${startDateYmd}|${conversationId.toString()}`);
  return Buffer.from(payload, 'utf8').toString('base64');
}

/**
 * 안전한 JSON 파싱
 */
function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}
