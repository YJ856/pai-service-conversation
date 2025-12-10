import { IsNotEmpty, IsString } from "class-validator";
import { TrimString } from "../common/transform";
import { EndConversationPathParam as SharedPath } from "pai-shared-types";

export class EndConversationPathParam implements SharedPath {
    @IsString() @IsNotEmpty() @TrimString()
    conversationSessionId!: string;
}