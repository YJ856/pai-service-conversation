export const CONVERSATION_TOKENS = {
  TokenVersionQueryPort: Symbol('TokenVersionQueryPort'),

  // Use Cases
  RecordConversationUseCase: Symbol('RecordConversationUseCase'),
  EndConversationUseCase: Symbol('EndConversationUseCase'),
  GetConversationsUseCase: Symbol('GetConversationsUseCase'),
  GetConversationDetailUseCase: Symbol('GetConversationDetailUseCase'),
  GetConversationsCalendarUseCase: Symbol('GetConversationsCalendarUseCase'),

  // Ports
  SessionRepositoryPort: Symbol('SessionRepositoryPort'),
  IdGeneratorPort: Symbol('IdGeneratorPort'),
  ConversationRepositoryPort: Symbol('ConversationRepositoryPort'),
  ConversationQueryPort: Symbol('ConversationQueryPort'),
  InsightsApiPort: Symbol('InsightsApiPort'),
  UserApiPort: Symbol('UserApiPort'),
  MediaApiPort: Symbol('MediaApiPort'),
};
