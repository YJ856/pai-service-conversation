import { Injectable } from "@nestjs/common";
import { EndConversationPathParam } from "../dto/request/end-conversation-request.dto";
import { EndConversationCommand } from "src/application/command/end-conversation.command";
import { EndConversationResponseResult } from "src/application/port/in/result/end-conversation-result.dto";
import { EndConversationResponseData } from "pai-shared-types";

@Injectable()
export class EndConversationMapper {
    toCommand(path: EndConversationPathParam, childProfileId: number, profileType: 'child' | 'parent'): EndConversationCommand {
        return new EndConversationCommand(
            childProfileId,
            path.conversationSessionId,
            profileType
        );
    }


    toResponse(result: EndConversationResponseResult): EndConversationResponseData {
        return {
            conversationId: result.conversationId?.toString()
        };
    }
}