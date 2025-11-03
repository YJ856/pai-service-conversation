import { Injectable } from '@nestjs/common';
import type { GetConversationsResponseData } from 'pai-shared-types';
import type { GetConversationsResult } from '../../../../application/port/in/result/get-conversations-result.dto';
import { GetConversationsCommand } from '../../../../application/command/get-conversations.command';
import { GetConversationsQueryParam } from '../dto/request/get-conversations-request.dto';

@Injectable()
export class GetConversationsMapper {
  toCommand(query: GetConversationsQueryParam): GetConversationsCommand {
    return new GetConversationsCommand(
      query.childId,
      query.date,
      query.cursor,
      query.limit,
    );
  }

  toResponse(result: GetConversationsResult): GetConversationsResponseData {
    return {
      items: result.items.map((item) => ({
        conversationId: item.conversationId.toString(), // bigint -> string
        startDate: item.startDate,
        title: item.title,
        firstMediaId: item.firstMediaId?.toString() ?? null, // bigint | null -> string | null
      })),
      nextCursor: result.nextCursor ?? null,
      hasNext: result.hasNext,
    };
  }
}
