
export class StartDate {
  private constructor(readonly ymd: string) {
    Object.freeze(this);
  }

  // 'yyyy-MM-dd' 입력을 검증해서 VO 생성
  static fromYmd(ymd: string): StartDate {
    if (typeof ymd !== 'string') throw new Error('StartDate must be string');
    const trimmedYmd = ymd.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedYmd)) {
      throw new Error('StartDate must be in yyyy-MM-dd');
    }
    // 달력 유효성(02/30 등) 검증: 파싱→ISO 왕복 비교
    const date = new Date(`${trimmedYmd}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== trimmedYmd) {
      throw new Error('Invalid calendar date for StartDate');
    }
    return new StartDate(trimmedYmd);
  }

  // KST기준 오늘을 ymd로 생성
  static todayKST(now: Date = new Date()): StartDate {
    const kstMs = now.getTime() + 9 * 60 * 60 * 1000; // UTC → KST(+9h)
    const kst = new Date(kstMs);
    const y = kst.getUTCFullYear();
    const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
    const d = String(kst.getUTCDate()).padStart(2, '0');
    return new StartDate(`${y}-${m}-${d}`);
  }

  // ISO 문자열로 생성 (alias for fromYmd)
  static ofISO(iso: string): StartDate {
    return StartDate.fromYmd(iso);
  }

  // Date 객체로부터 생성
  static of(date: Date): StartDate {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return new StartDate(`${y}-${m}-${d}`);
  }

  // Prisma(DateTime) 저장용 UTC 00:00 Date로 변환
  toUtcStartOfDay(): Date {
    return new Date(`${this.ymd}T00:00:00.000Z`);
  }

  // Date 객체로 변환
  toDate(): Date {
    return this.toUtcStartOfDay();
  }

  // ISO 문자열로 변환
  toISO(): string {
    return this.ymd;
  }

  // 문자열로 꺼낼 때
  toString(): string {
    return this.ymd;
  }

  equals(other: StartDate): boolean {
    return this.ymd === other.ymd;
  }
}
