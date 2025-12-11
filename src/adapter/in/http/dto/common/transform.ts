import { Transform } from 'class-transformer';

// 문자열이면 trim만 수행
export const TrimString = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );

// 문자열이면 trim, 키 값이 안 들어오면 undefined로
export const TrimToUndefined = () =>
  Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    const t = value.trim();
    return t === '' ? undefined : t;
  });

// 문자열이면 trim, 결과가 빈 문자열이면 null
export const TrimToNull = () =>
  Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    const t = value.trim();
    return t === '' ? null : t;
  });

// 쿼리/바디에 들어온 값을 number로 (null/undefined/'' -> undefined)
export const ToNumber = () =>
  Transform(({ value }: { value: unknown }) => {
    // null/undefined -> undefined
    if (value == null) return undefined;

    // 문자열이면 trim 후 빈값 체크
    if (typeof value === 'string') {
      const t = value.trim();
      if (t === '') return undefined;
      const n = Number(t);
      return Number.isFinite(n) ? n : undefined;
    }

    // 그 외 타입(숫자 등)
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  });

// ToNumber + 클램프(min ~ max 범위로)
export const ToNumberClamped = (defaultValue = 20, min = 1, max = 50) =>
  Transform(({ value }: { value: unknown }) => {
    // 기본값 처리
    const fallback = defaultValue;

    // null/undefined는 바로 기본값
    if (value == null) return fallback;

    // 문자열이면 trim 후 빈값 체크
    let raw = value;
    if (typeof raw === 'string') {
      raw = raw.trim();
      if (raw === '') return fallback;
    }

    // 숫자 변환
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;

    // 클램프
    if (n < min) return min;
    if (n > max) return max;
    return n;
  });
