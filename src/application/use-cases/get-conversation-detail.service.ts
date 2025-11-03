import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import type { GetConversationDetailUseCase } from '../port/in/get-conversation-detail.usecase';
import type { GetConversationDetailResult } from '../port/in/result/get-conversation-detail-result.dto';
import type { ConversationQueryPort } from '../port/out/conversation.query.port';

import { GetConversationDetailCommand } from '../command/get-conversation-detail.command';
import { CONVERSATION_TOKENS } from '../../conversation.token';

@Injectable()
export class GetConversationDetailService implements GetConversationDetailUseCase {
  constructor(
    @Inject(CONVERSATION_TOKENS.ConversationQueryPort)
    private readonly conversationQuery: ConversationQueryPort,
  ) {}

  async execute(command: GetConversationDetailCommand): Promise<GetConversationDetailResult> {
    // 1. 대화 조회
    const conversation = await this.conversationQuery.findById(command.conversationId);

    if (!conversation) {
      throw new NotFoundException('CONVERSATION_NOT_FOUND');
    }

    // 2. 권한 확인 (자녀 프로필 일치 여부)
    if (conversation.getChildProfileId() !== command.childProfileId) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    // 3. 결과 반환
    return {
      conversationId: conversation.getId()!,
      childProfileId: conversation.getChildProfileId(),
      startDate: conversation.getStartDate().toISO(),
      title: conversation.getTitle(),
      firstMediaId: conversation.getFirstMediaId(),
      items: conversation.getQuestions().map((q) => ({
        order: q.getOrder().value,
        questionText: q.getQuestionText(),
        answerText: q.getAnswerText(),
        imageMediaId: q.getImageMediaId(),
        keyword: q.getKeyword(),
      })),
    };
  }
}
