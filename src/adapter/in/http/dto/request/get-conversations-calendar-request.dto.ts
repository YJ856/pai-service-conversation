import { IsNotEmpty, IsInt, IsOptional, IsPositive } from 'class-validator';
import { ToNumber } from '../common/transform';
import { GetConversationsCalendarQueryParam as SharedQuery } from 'pai-shared-types';

export class GetConversationsCalendarQueryParam implements SharedQuery {
  @ToNumber()
  @IsNotEmpty()
  @IsInt()
  year!: number;

  @ToNumber()
  @IsNotEmpty()
  @IsInt()
  month!: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @IsPositive()
  childProfileId?: number;
}
