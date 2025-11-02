import {
    Controller,
    Param,
    Post,
} from '@nestjs/common';

import type {
    BaseResponse,
    RecordConversationResponseData,
    EndConversationResponseData,
} from 'pai-shared-types';

import { RecordConversationRequestDto } from '../dto/request/record-conversation-request.dto';
import { EndConversationPathParam } from '../dto/request/end-conversation-request.dto';
import { EndConversationMapper } from '../mapper/end-conversation.mapper';


@Controller('api/conversations')
export class ConversationController {
    constructor(
        private readonly endConversationMapper: EndConversationMapper,
        
    ) {}

    @Post(':conversationSessionId/end')
    async endConversation(
        @Auth('profileId') childProfileId: number,
        @Param() path: EndConversationPathParam,
    ): Promise<BaseResponse<EndConversationResponseData>> {
        const command = this.endConversationMapper.toCommand(path, childProfileId);
    }
}