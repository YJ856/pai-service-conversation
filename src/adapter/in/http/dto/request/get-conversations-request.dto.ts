import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsBase64,
  IsPositive,
} from 'class-validator';
import type { GetConversationsQueryParam as SharedQuery } from 'pai-shared-types';
import {
  TrimToUndefined,
  ToNumber,
  ToNumberClamped,
} from '../common/transform';

export class GetConversationsQueryParam implements SharedQuery {
  @ToNumber()
  @IsInt()
  @IsPositive()
  childProfileId!: number;

  @IsOptional()
  @IsString()
  @TrimToUndefined()
  date?: string; // yyyy-MM-dd

  @IsOptional()
  @IsString()
  @TrimToUndefined()
  @IsBase64({ urlSafe: true })
  cursor?: string;

  @ToNumberClamped(20, 1, 50)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
