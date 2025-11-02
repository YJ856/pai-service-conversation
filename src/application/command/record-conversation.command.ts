export class RecordConversationCommand {
    constructor(
        public readonly childProfileId: number,
        public readonly conversationSessionId: string | null,
        public readonly questionText: string,
        public readonly imageMediaId: bigint | null,
        public readonly keyword: string | null,
        public readonly answerText: string,
    ) {}
}