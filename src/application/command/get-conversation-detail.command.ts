export class GetConversationDetailCommand {
  constructor(
    public readonly conversationId: bigint,
    public readonly childProfileId: number, // 인증된 프로필 ID (권한 체크용)
  ) {}
}
