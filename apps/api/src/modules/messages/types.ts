export type MessagesContext = {
  accessToken: string;
  userId: string;
};

export type MessageCursor = {
  createdAt: string;
  id: string;
};

export type MessagePartner = {
  id: string;
  username: string;
  avatarPath: string | null;
  avatarUrl: string | null;
};

export type MessageView = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  isMine: boolean;
};

export type ConversationSummary = {
  partner: MessagePartner;
  lastMessage: MessageView | null;
  unreadCount: number;
  updatedAt: string;
};

export type MessagesSidebarData = {
  conversations: ConversationSummary[];
  followingProfiles: MessagePartner[];
};

export type MessageHistoryPage = {
  partner: MessagePartner;
  items: MessageView[];
  nextCursor: MessageCursor | null;
};

export type SendMessageInput = {
  receiverId: string;
  content: string;
};

export type PreparedSendMessageInput = {
  receiverId: string;
  content: string;
};

export type MessagesRepository = {
  findProfileById: (context: MessagesContext, profileId: string) => Promise<MessagePartner | null>;
  findConversations: (context: MessagesContext, limit: number) => Promise<ConversationSummary[]>;
  findFollowingProfiles: (context: MessagesContext, limit: number) => Promise<MessagePartner[]>;
  findConversationMessages: (
    context: MessagesContext,
    input: {
      partnerId: string;
      cursor: MessageCursor | null;
      limit: number;
    }
  ) => Promise<MessageView[]>;
  createMessage: (
    context: MessagesContext,
    input: PreparedSendMessageInput
  ) => Promise<MessageView>;
  markConversationAsRead: (context: MessagesContext, partnerId: string) => Promise<number>;
};