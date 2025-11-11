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
    toCommand(childProfileId: number, body: RecordConversationRequestDto): RecordConversationCommand {
        return new RecordConversationCommand(
            childProfileId,
            body.conversationSessionId || null,
            body.questionText,
            toBigIntOrNull(body.imageMediaId),
            body.keyword,
            body.answerText,
        );
    }

    toResponseResult(data: {
        conversationSessionId: string;
        questionOrder: number;
        firstMediaId?: bigint | null;
    }): RecordConversationResponseResult {
        return {
            conversationSessionId: data.conversationSessionId,
            questionOrder: data.questionOrder,
            firstMediaId: data.firstMediaId ?? undefined, // undefined면 응답에서 빠짐
        };
    }

    toResponse(result: RecordConversationResponseResult): RecordConversationResponseData {
        const base: RecordConversationResponseData = {
            conversationSessionId: result.conversationSessionId,
            questionOrder: result.questionOrder,
        };
        if (result.firstMediaId != null) {
            return {...base, firstMediaId: result.firstMediaId.toString() };
        }
        return base;
    }
}