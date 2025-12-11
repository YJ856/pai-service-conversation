export class GetConversationsCalendarCommand {
  constructor(
    public readonly year: number,
    public readonly month: number,
    public readonly childProfileId?: number,
  ) {}
}
