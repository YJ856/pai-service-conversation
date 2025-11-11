import { Inject, Injectable } from "@nestjs/common";
import { GetConversationsCalendarUseCase } from "../port/in/get-conversations-calendar.usecase";
import { GetConversationsCalendarCommand } from "../command/get-conversations-calendar.command";
import { GetConversationsCalendarResult } from "../port/in/result/get-conversations-calendar-result.dto";

@Injectable()
export class GetConversationsCalendarService implements GetConversationsCalendarUseCase {
    constructor(
        
    ) {}

    async execute(command: GetConversationsCalendarCommand): Promise<GetConversationsCalendarResult> {
        
    }
}