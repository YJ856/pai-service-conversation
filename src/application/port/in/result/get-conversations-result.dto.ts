export interface ConversationGalleryItem {
  conversationId: bigint;
  startDate: string; // yyyy-MM-dd
  title: string | null;
  firstMediaId: bigint | null;
}

export interface GetConversationsResult {
  items: ConversationGalleryItem[];
  nextCursor: string | null;
  hasNext: boolean;
}
