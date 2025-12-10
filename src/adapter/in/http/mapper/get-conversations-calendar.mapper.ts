import { Injectable } from "@nestjs/common";
import type { GetConversationsCalendarResponseData } from "pai-shared-types";
import type { GetConversationsCalendarResult } from "src/application/port/in/result/get-conversations-calendar-result.dto";
import { GetConversationsCalendarCommand } from "src/application/command/get-conversations-calendar.command";
import { GetConversationsCalendarQueryParam } from "../dto/request/get-conversations-calendar-request.dto";

@Injectable()
export class GetConversationsCalendarMapper {
    toCommand(query: GetConversationsCalendarQueryParam): GetConversationsCalendarCommand {
        return new GetConversationsCalendarCommand(
            query.year,
            query.month,
            query.childProfileId,
        );
    }

    toResponse(result: GetConversationsCalendarResult): GetConversationsCalendarResponseData {
        return {
            year: result.year,
            month: result.month,
            totalCount: result.totalCount,
            days: result.days.map(day => ({
                date: day.date,
                count: day.count,
                children: day.children.map(child => ({
                    childProfileId: child.childProfileId,
                    childName: child.childName,
                    childAvatarMediaId: child.childAvatarMediaId?.toString() ?? null,
                    count: child.count,
                })),
            })),
        };
    }
}