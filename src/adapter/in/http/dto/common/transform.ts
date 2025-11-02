import { Transform } from "class-transformer";


// 문자열이면 trim만 수행
export const TrimString = () =>
    Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));


// 문자열이면 trim, 결과가 빈 문자열이면 -> null
export const TrimToNull = () => 
    Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        const t = value.trim();
        return t === '' ? null : t;
    })