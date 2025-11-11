export interface ConversationsCalendarChildCount {
    childProfileId: number;
    childName: string;
    childAvatarMediaId: bigint | null;
    count: number;
}

export interface ConversationsCalendarDaySummary {
    date: string;
    count: number;
    children: ConversationsCalendarChildCount[];
}

export interface GetConversationsCalendarResult {
    year: number;
    month: number;
    totalCount: number;
    days: ConversationsCalendarDaySummary[];
}
