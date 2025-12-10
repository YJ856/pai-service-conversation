export interface ConversationDetailQuestion {
  order: number;
  questionText: string;
  answerText: string;
  imageMediaId: bigint | null;
  keyword: string | null;
}

export interface GetConversationDetailResult {
  conversationId: bigint;
  childProfileId: number;
  startDate: string; // yyyy-MM-dd
  title: string | null;
  firstMediaId: bigint | null;
  items: ConversationDetailQuestion[];
}
