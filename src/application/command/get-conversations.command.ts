export class GetConversationsCommand {
  constructor(
    public readonly childProfileId: number,
    public readonly date?: string, // yyyy-MM-dd
    public readonly cursor?: string, // Base64 encoded
    public readonly limit?: number,
  ) {}
}
