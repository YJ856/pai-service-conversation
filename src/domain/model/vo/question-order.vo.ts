/**
 * - 책임: 정수, 1 이상만 보장
 * - 연속성(1,2,3...): Aggregate에서 검사 (여기선 안 함)
 */
export class QuestionOrder {
  private constructor(readonly value: number) {
    Object.freeze(this);
  }

  // 정수 & >= 1 검증
  static create(n: number): QuestionOrder {
    if (!Number.isInteger(n)) {
      throw new Error('QuestionOrder must be an integer');
    }
    if (n <= 0) {
      throw new Error('QuestionOrder must be >= 1');
    }
    return new QuestionOrder(n);
  }

  // 문자열로 들어오는 경우 편의 팩토리(선택 사용)
  static fromString(s: string): QuestionOrder {
    const n = Number(s);
    if (!Number.isFinite(n)) {
      throw new Error('QuestionOrder string is not a finite number');
    }
    return QuestionOrder.create(Math.trunc(n));
  }

  // 다음 순서 값(편의 함수, 필요 없으면 사용 안 해도 됨)
  next(): QuestionOrder {
    return new QuestionOrder(this.value + 1);
  }

  // 기본 타입 꺼내기
  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return String(this.value);
  }

  // 동등성
  equals(other: QuestionOrder): boolean {
    return !!other && this.value === other.value;
  }
}
