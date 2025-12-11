export class EndConversationCommand {
  constructor(
    public readonly childProfileId: number,
    public readonly conversationSessionId: string,
    public readonly profileType: 'child' | 'parent',
  ) {}
}
