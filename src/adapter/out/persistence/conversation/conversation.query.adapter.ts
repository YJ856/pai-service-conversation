import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  ConversationQueryPort,
  ConversationListItem,
  GetConversationsParams,
} from '../../../../application/port/out/conversation.query.port';
import { Conversation } from '../../../../domain/model/entity/conversation.entity';
import { Question } from '../../../../domain/model/entity/question.entity';
import { StartDate } from '../../../../domain/model/vo/start-date.vo';
import { QuestionOrder } from '../../../../domain/model/vo/question-order.vo';

@Injectable()
export class ConversationQueryAdapter implements ConversationQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findConversations(params: GetConversationsParams): Promise<ConversationListItem[]> {
    const { childProfileId, date, cursor, limit } = params;

    // WHERE 조건 구성
    const where: any = {
      childProfileId,
    };

    // 특정 날짜 필터링
    if (date) {
      const targetDate = new Date(`${date}T00:00:00.000Z`);
      where.startDate = targetDate;
    }

    // 커서 기반 필터링 (startDate DESC, id DESC)
    if (cursor) {
      const cursorDate = new Date(`${cursor.startDateYmd}T00:00:00.000Z`);
      where.OR = [
        // startDate가 커서보다 작은 경우
        { startDate: { lt: cursorDate } },
        // startDate가 같고 id가 커서보다 작은 경우
        {
          startDate: cursorDate,
          id: { lt: cursor.conversationId },
        },
      ];
    }

    // 조회 (limit + 1개)
    const rows = await this.prisma.conversation.findMany({
      where,
      orderBy: [
        { startDate: 'desc' },
        { id: 'desc' },
      ],
      take: limit + 1,
      select: {
        id: true,
        startDate: true,
        title: true,
        firstMediaId: true,
      },
    });

    // 결과 변환
    return rows.map((row) => ({
      conversationId: row.id,
      startDate: this.dateToYmd(row.startDate),
      title: row.title,
      firstMediaId: row.firstMediaId,
    }));
  }

  async findById(conversationId: bigint): Promise<Conversation | null> {
    const row = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
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

    if (!row) return null;

    // 도메인 객체로 변환
    const questions = row.questions.map((q) =>
      Question.rehydrate({
        id: q.id,
        order: QuestionOrder.create(q.questionOrder),
        questionText: q.questionText,
        imageMediaId: q.imageMediaId,
        keyword: q.keyword,
        answerText: q.answer?.answerText ?? '',
      })
    );

    return Conversation.rehydrate({
      id: row.id,
      childProfileId: row.childProfileId,
      startDate: StartDate.of(row.startDate),
      title: row.title,
      ended: true, // DB에 저장된 것은 종료된 대화
      firstMediaId: row.firstMediaId,
      questions,
    });
  }

  private dateToYmd(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
