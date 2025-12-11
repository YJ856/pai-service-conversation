import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  ConversationQueryPort,
  ConversationListItem,
  GetConversationsParams,
  DailyChildCountRow,
} from '../../../../application/port/out/conversation.query.port';
import { Conversation } from '../../../../domain/model/entity/conversation.entity';
import { Question } from '../../../../domain/model/entity/question.entity';
import { StartDate } from '../../../../domain/model/vo/start-date.vo';
import { QuestionOrder } from '../../../../domain/model/vo/question-order.vo';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConversationQueryAdapter implements ConversationQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findConversations(
    params: GetConversationsParams,
  ): Promise<ConversationListItem[]> {
    const { childProfileId, date, cursor, limit } = params;

    // WHERE 조건 구성
    const where: Prisma.ConversationWhereInput = {
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
      orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
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

  async findDetailConversationById(
    conversationId: bigint,
  ): Promise<Conversation | null> {
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
    const questions = row.questions.map((question) =>
      Question.rehydrate({
        id: question.id,
        order: QuestionOrder.create(question.questionOrder),
        questionText: question.questionText,
        imageMediaId: question.imageMediaId,
        keyword: question.keyword,
        answerText: question.answer?.answerText ?? '',
      }),
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

  async getDailyConversationCounts(params: {
    year: number;
    month: number;
    childProfileIds: number[];
  }): Promise<DailyChildCountRow[]> {
    const { year, month, childProfileIds } = params;

    if (!childProfileIds?.length) return [];

    // 해당 월의 시작일과 종료일 계산
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const rows = await this.prisma.$queryRaw<
      Array<{
        date: Date;
        childProfileId: number;
        count: bigint;
      }>
    >`
      SELECT
        "startDate" as date,
        "childProfileId",
        COUNT(*) as count
      FROM "Conversation"
      WHERE "childProfileId" = ANY(${childProfileIds})
        AND "startDate" >= ${startDate}::date
        AND "startDate" < ${endDate}::date
      GROUP BY "startDate", "childProfileId"
      ORDER BY "startDate", "childProfileId"
    `;

    // 결과 변환
    return rows.map((row) => ({
      date: this.dateToYmd(row.date),
      childProfileId: row.childProfileId,
      count: Number(row.count),
    }));
  }

  private dateToYmd(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
