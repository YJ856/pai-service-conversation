import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';
import { TrimString } from '../common/transform';

export class GetConversationDetailPathParam {
  @TrimString()
  @IsString()
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  conversationId!: string;
}
