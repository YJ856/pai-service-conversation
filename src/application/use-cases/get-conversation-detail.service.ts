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

    const conversation = await this.conversationQuery.findDetailConversationById(command.conversationId);

    if (!conversation) {
      throw new NotFoundException('CONVERSATION_NOT_FOUND');
    }

    return {
      conversationId: conversation.getId()!,
      childProfileId: conversation.getChildProfileId(),
      startDate: conversation.getStartDate().toISO(),
      title: conversation.getTitle(),
      firstMediaId: conversation.getFirstMediaId(),
      items: conversation.getQuestions().map((question) => ({
        order: question.getOrder().value,
        questionText: question.getQuestionText(),
        answerText: question.getAnswerText(),
        imageMediaId: question.getImageMediaId(),
        keyword: question.getKeyword(),
      })),
    };
  }
}
