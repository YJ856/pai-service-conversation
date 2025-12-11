import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import type { GetConversationsUseCase } from '../port/in/get-conversations.usecase';
import type { GetConversationsResult } from '../port/in/result/get-conversations-result.dto';
import type { ConversationQueryPort } from '../port/out/conversation.query.port';

import { GetConversationsCommand } from '../command/get-conversations.command';
import { CONVERSATION_TOKENS } from '../../conversation.token';
import {
  decodeCompositeCursor,
  encodeCompositeCursor,
} from '../../utils/cursor.util';

@Injectable()
export class GetConversationsService implements GetConversationsUseCase {
  private readonly DEFAULT_LIMIT = 20;
  private readonly MAX_LIMIT = 50;

  constructor(
    @Inject(CONVERSATION_TOKENS.ConversationQueryPort)
    private readonly conversationQuery: ConversationQueryPort,
  ) {}

  async execute(
    command: GetConversationsCommand,
  ): Promise<GetConversationsResult> {
    // 1. childProfileId 검증
    if (!command.childProfileId || command.childProfileId <= 0) {
      throw new BadRequestException(
        'VALIDATION_ERROR: childProfileId required',
      );
    }

    // 2. limit 검증 및 기본값 설정
    let limit = command.limit ?? this.DEFAULT_LIMIT;
    if (limit <= 0 || limit > this.MAX_LIMIT) {
      limit = this.DEFAULT_LIMIT;
    }

    // 3. 커서 디코딩
    const cursor = command.cursor
      ? (decodeCompositeCursor(command.cursor) ?? undefined)
      : undefined;

    // 4. 조회 (limit + 1개)
    const items = await this.conversationQuery.findConversations({
      childProfileId: command.childProfileId,
      date: command.date,
      cursor,
      limit,
    });

    // 5. hasNext 판단 및 결과 분리
    const hasNext = items.length > limit;
    const resultItems = hasNext ? items.slice(0, limit) : items;

    // 6. nextCursor 생성
    let nextCursor: string | null = null;
    if (hasNext && resultItems.length > 0) {
      const lastItem = resultItems[resultItems.length - 1];
      nextCursor = encodeCompositeCursor(
        lastItem.startDate,
        lastItem.conversationId,
      );
    }

    // 7. 결과 반환
    return {
      items: resultItems.map((item) => ({
        conversationId: item.conversationId,
        startDate: item.startDate,
        title: item.title,
        firstMediaId: item.firstMediaId,
      })),
      nextCursor,
      hasNext,
    };
  }
}
