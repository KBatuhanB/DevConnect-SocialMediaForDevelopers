export const messagesConfig = {
  routePath: "/api/messages",
  realtimeAuthPath: "/api/messages/realtime-auth",
  columns: {
    profile: "id, username, avatar_path",
    message: "id, sender_id, receiver_id, content, is_read, created_at"
  },
  profile: {
    avatarPublicBaseUrl: "/storage/v1/object/public/avatars"
  },
  limits: {
    conversationListSize: 20,
    conversationCandidateLimit: 200,
    historyPageSize: 30,
    historyQueryLimit: 31,
    messageMaxLength: 5000
  }
} as const;