import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import type { RecordConversationUseCase } from '../port/in/record-conversation.usecase';
import type { RecordConversationResponseResult } from '../port/in/result/record-conversation-result.dto';
import type { SessionRepositoryPort } from '../port/out/session.repository.port';
import type { IdGeneratorPort } from '../port/out/id-generator.port';

import { RecordConversationCommand } from '../command/record-conversation.command';

import { Conversation } from '../../domain/model/entity/conversation.entity';
import { Question } from '../../domain/model/entity/question.entity';
import { QuestionOrder } from '../../domain/model/vo/question-order.vo';
import { StartDate } from '../../domain/model/vo/start-date.vo';

import { CONVERSATION_TOKENS } from '../../conversation.token';

@Injectable()
export class RecordConversationService implements RecordConversationUseCase {
  constructor(
    @Inject(CONVERSATION_TOKENS.SessionRepositoryPort)
    private readonly sessionRepository: SessionRepositoryPort,

    @Inject(CONVERSATION_TOKENS.IdGeneratorPort)
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(
    command: RecordConversationCommand,
  ): Promise<RecordConversationResponseResult> {
    // 1. 세션 ID 확인 또는 생성
    const sessionId =
      command.conversationSessionId ?? this.idGenerator.newSessionId();

    // 2. 기존 세션이 있으면 로드, 없으면 새로 생성
    let conversation = await this.sessionRepository.load(sessionId);

    if (!conversation) {
      // 첫 질문/답변인 경우 - 새로운 Conversation 생성
      conversation = Conversation.create({
        childProfileId: command.childProfileId,
        startDate: StartDate.todayKST(),
      });
    }

    // 3. 현재 질문 순서 계산 (기존 질문 개수 + 1)
    const currentOrder = conversation.getQuestions().length + 1;

    // 4. 새로운 질문 생성 및 추가
    const question = Question.create({
      order: QuestionOrder.create(currentOrder),
      questionText: command.questionText,
      imageMediaId: command.imageMediaId,
      keyword: command.keyword,
      answerText: command.answerText,
    });

    try {
      conversation.addQuestion(question);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    // 5. Redis에 저장
    await this.sessionRepository.save(sessionId, conversation);

    // 6. 결과 반환
    return {
      conversationSessionId: sessionId,
      questionOrder: currentOrder,
      firstMediaId: conversation.getFirstMediaId() ?? undefined,
    };
  }
}
