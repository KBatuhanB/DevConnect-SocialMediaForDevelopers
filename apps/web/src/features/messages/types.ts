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

export type RealtimeAuth = {
  accessToken: string;
  userId: string;
};

export type MessageDeliveryState = "sending" | "sent" | "error";

export type ThreadMessage = MessageView & {
  key: string;
  deliveryState: MessageDeliveryState;
  errorMessage: string | null;
};