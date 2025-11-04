import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ConversationRepositoryPort } from '../../../../application/port/out/conversation.repository.port';
import { Conversation } from '../../../../domain/model/entity/conversation.entity';
import { Question } from '../../../../domain/model/entity/question.entity';
import { StartDate } from '../../../../domain/model/vo/start-date.vo';
import { QuestionOrder } from '../../../../domain/model/vo/question-order.vo';

@Injectable()
export class ConversationRepositoryAdapter implements ConversationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(conversation: Conversation): Promise<Conversation> {
    // Conversation과 연관된 Question, Answer를 한 트랜잭션에서 저장
    const savedConversation = await this.prisma.$transaction(async (tx) => {
      // 1. Conversation 저장
      const conversationRow = await tx.conversation.create({
        data: {
          childProfileId: conversation.getChildProfileId(),
          startDate: conversation.getStartDate().toDate(),
          title: conversation.getTitle(),
          firstMediaId: conversation.getFirstMediaId(),
        },
      });

      // 2. Questions와 Answers 저장
      const questions = conversation.getQuestions();
      for (const question of questions) {
        const questionRow = await tx.question.create({
          data: {
            conversationId: conversationRow.id,
            questionOrder: question.getOrder().value,
            questionText: question.getQuestionText(),
            imageMediaId: question.getImageMediaId(),
            keyword: question.getKeyword(),
          },
        });

        // Answer 저장
        await tx.answer.create({
          data: {
            questionId: questionRow.id,
            answerText: question.getAnswerText(),
          },
        });
      }

      // 3. 저장된 데이터를 다시 조회해서 도메인 객체로 변환
      const fullConversation = await tx.conversation.findUnique({
        where: { id: conversationRow.id },
        include: {
          questions: {
            include: {
              answer: true,
            },
            orderBy: {
              questionOrder: 'asc',
            },
          },
        },
      });

      if (!fullConversation) {
        throw new Error('Failed to retrieve saved conversation');
      }

      // 4. 도메인 객체로 변환
      const domainQuestions = fullConversation.questions.map((question) =>
        Question.rehydrate({
          id: question.id,
          order: QuestionOrder.create(question.questionOrder),
          questionText: question.questionText,
          imageMediaId: question.imageMediaId,
          keyword: question.keyword,
          answerText: question.answer?.answerText ?? '',
        })
      );

      return Conversation.rehydrate({
        id: fullConversation.id,
        childProfileId: fullConversation.childProfileId,
        startDate: StartDate.of(fullConversation.startDate),
        title: fullConversation.title,
        ended: true, // DB에 저장된 것은 종료된 대화
        firstMediaId: fullConversation.firstMediaId,
        questions: domainQuestions,
      });
    });

    return savedConversation;
  }
}
