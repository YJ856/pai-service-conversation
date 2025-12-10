import type { GetConversationsCalendarCommand } from "src/application/command/get-conversations-calendar.command";
import type { GetConversationsCalendarResult } from "./result/get-conversations-calendar-result.dto";

export interface GetConversationsCalendarUseCase {
    execute(command: GetConversationsCalendarCommand): Promise<GetConversationsCalendarResult>;
}