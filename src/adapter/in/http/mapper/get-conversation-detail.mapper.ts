import { Injectable } from '@nestjs/common';
import type { GetConversationDetailResponseData } from 'pai-shared-types';
import type { GetConversationDetailResult } from '../../../../application/port/in/result/get-conversation-detail-result.dto';
import { GetConversationDetailCommand } from '../../../../application/command/get-conversation-detail.command';
import { GetConversationDetailPathParam } from '../dto/request/get-conversation-detail-request.dto';

@Injectable()
export class GetConversationDetailMapper {
  toCommand(
    pathParam: GetConversationDetailPathParam,
    childProfileId: number,
  ): GetConversationDetailCommand {
    return new GetConversationDetailCommand(
      BigInt(pathParam.conversationId), // string -> bigint
      childProfileId,
    );
  }

  toResponse(result: GetConversationDetailResult): GetConversationDetailResponseData {
    return {
      conversationId: result.conversationId.toString(), // bigint -> string
      childProfileId: result.childProfileId,
      startDate: result.startDate,
      title: result.title,
      firstMediaId: result.firstMediaId?.toString() ?? null, // bigint | null -> string | null
      items: result.items.map((item) => ({
        order: item.order,
        questionText: item.questionText,
        answerText: item.answerText,
        imageMediaId: item.imageMediaId?.toString() ?? null, // bigint | null -> string | null
        keyword: item.keyword,
      })),
    };
  }
}
