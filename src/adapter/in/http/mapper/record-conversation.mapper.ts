import { Injectable } from "@nestjs/common";
import { RecordConversationRequestDto } from "../dto/request/record-conversation-request.dto";
import { RecordConversationCommand } from "src/application/command/record-conversation.command";
import { RecordConversationResponseResult } from "src/application/port/in/result/record-conversation-result.dto";
import { RecordConversationResponseData } from "pai-shared-types";


function toBigIntOrNull(value: string | null | undefined): bigint | null {
    if (value == null) return null;
    const trimmedString = String(value).trim();
    if (trimmedString === "") return null;
    if (!trimmedString || !/^\d+$/.test(trimmedString)) return null;
    return BigInt(trimmedString);
}


@Injectable()
export class RecordConversationMapper {
    toCommand(childProfileId: number, dto: RecordConversationRequestDto): RecordConversationCommand {
        return new RecordConversationCommand(
            childProfileId,
            dto.conversationSessionId,
            dto.questionText,
            toBigIntOrNull(dto.imageMediaId),
            dto.keyword,
            dto.answerText,
        );
    }
}