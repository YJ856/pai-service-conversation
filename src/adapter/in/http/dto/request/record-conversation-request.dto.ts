import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"
import { TrimString, TrimToNull } from "../common/transform";
import { RecordConversationRequestDto as SharedBody } from "pai-shared-types"


export class RecordConversationRequestDto implements SharedBody {
    @IsOptional() @IsString() @TrimToNull()
    conversationSessionId: string | null;

    @IsString() @TrimString() @IsNotEmpty()
    questionText!: string;

    @IsOptional() @IsString() @TrimToNull()
    imageMediaId: string | null;

    @IsOptional() @IsString() @TrimToNull()
    keyword: string | null;

    @IsString() @TrimString() @IsNotEmpty()
    answerText!: string;
}