import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetConversationsCalendarUseCase } from '../port/in/get-conversations-calendar.usecase';
import { GetConversationsCalendarCommand } from '../command/get-conversations-calendar.command';
import { GetConversationsCalendarResult } from '../port/in/result/get-conversations-calendar-result.dto';
import { CONVERSATION_TOKENS } from 'src/conversation.token';
import type { ConversationQueryPort } from '../port/out/conversation.query.port';
import type {
  ChildProfileSummary,
  UserApiPort,
} from '../port/out/user-api.port';

@Injectable()
export class GetConversationsCalendarService
  implements GetConversationsCalendarUseCase
{
  constructor(
    @Inject(CONVERSATION_TOKENS.UserApiPort)
    private readonly profiles: UserApiPort,

    @Inject(CONVERSATION_TOKENS.ConversationQueryPort)
    private readonly conversationQuery: ConversationQueryPort,
  ) {}

  async execute(
    command: GetConversationsCalendarCommand,
  ): Promise<GetConversationsCalendarResult> {
    const { year, month } = command;

    // 입력 검증
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      throw new BadRequestException('VALIDATION_ERROR: year/month invalid');
    }

    // 가족 구성원 중 아이 프로필 정보 조회
    const { children } =
      await this.profiles.getFamilyProfileWithScopeChildren();
    const childList = children ?? [];

    if (childList.length === 0) {
      return { year, month, totalCount: 0, days: [] };
    }

    // 아이 정보 빠르게 찾는 맵 만들기
    const childById: Record<number, ChildProfileSummary> = Object.fromEntries(
      childList.map((child) => [child.profileId, child]),
    );
    const familyChildIds = childList.map((child) => child.profileId);

    // 연/월 + 아이 전체 조회
    const rows = await this.conversationQuery.getDailyConversationCounts({
      year,
      month,
      childProfileIds: familyChildIds,
    });

    // 날짜별 합계 만들기
    const countsByDate = new Map<
      string,
      { count: number; children: Map<number, number> }
    >();
    let totalCount = 0;

    for (const row of rows) {
      totalCount += row.count;
      if (!countsByDate.has(row.date)) {
        countsByDate.set(row.date, { count: 0, children: new Map() });
      }
      const bucket = countsByDate.get(row.date)!;
      bucket.count += row.count;
      bucket.children.set(
        row.childProfileId,
        (bucket.children.get(row.childProfileId) ?? 0) + row.count,
      );
    }

    const days = Array.from(countsByDate.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, { count, children }]) => ({
        date,
        count,
        children: Array.from(children.entries())
          .sort(
            ([childId1, count1], [childId2, count2]) =>
              count2 - count1 || childId1 - childId2,
          )
          .map(([childProfileId, cnt]) => ({
            childProfileId: childProfileId,
            childName: childById[childProfileId]?.name ?? '',
            childAvatarMediaId:
              childById[childProfileId]?.avatarMediaId ?? null,
            count: cnt,
          })),
      }));

    return { year, month, totalCount, days };
  }
}
