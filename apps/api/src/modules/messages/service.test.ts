import { describe, expect, it, vi } from "vitest";
import { createMessagesService } from "./service";

function createPartner(id = "user-2") {
  return {
    id,
    username: `user-${id}`,
    avatarPath: null,
    avatarUrl: null
  };
}

function createMessage(id: string, createdAt: string, overrides?: Partial<ReturnType<typeof baseMessage>>) {
  return {
    ...baseMessage(),
    id,
    createdAt,
    ...overrides
  };
}

function baseMessage() {
  return {
    id: "message-1",
    senderId: "user-2",
    receiverId: "viewer-1",
    content: "Merhaba",
    isRead: false,
    createdAt: "2026-01-01T10:00:00.000Z",
    isMine: false
  };
}

describe("messages service", () => {
  it("konusma ve takip listelerini sabit limitlere gore ister", async () => {
    const findConversations = vi.fn(async () => []);
    const findFollowingProfiles = vi.fn(async () => []);
    const service = createMessagesService({
      findProfileById: async () => createPartner(),
      findConversations,
      findFollowingProfiles,
      findConversationMessages: async () => [],
      createMessage: async () => baseMessage(),
      markConversationAsRead: async () => 0
    });

    await service.getConversations({
      accessToken: "token-1",
      userId: "viewer-1"
    });

    expect(findConversations).toHaveBeenCalledWith(
      {
        accessToken: "token-1",
        userId: "viewer-1"
      },
      20
    );
    expect(findFollowingProfiles).toHaveBeenCalledWith(
      {
        accessToken: "token-1",
        userId: "viewer-1"
      },
      24
    );
  });

  it("takip listesinden zaten konusulan kisileri ayiklar", async () => {
    const service = createMessagesService({
      findProfileById: async () => createPartner(),
      findConversations: async () => [
        {
          partner: createPartner("user-2"),
          lastMessage: baseMessage(),
          unreadCount: 1,
          updatedAt: "2026-01-01T10:00:00.000Z"
        }
      ],
      findFollowingProfiles: async () => [createPartner("user-2"), createPartner("user-3")],
      findConversationMessages: async () => [],
      createMessage: async () => baseMessage(),
      markConversationAsRead: async () => 0
    });

    const result = await service.getConversations({
      accessToken: "token-1",
      userId: "viewer-1"
    });

    expect(result.followingProfiles.map((profile) => profile.id)).toEqual(["user-3"]);
  });

  it("gecmisi page size'a gore kirpar ve cursor uretir", async () => {
    const requestedLimits: number[] = [];
    const service = createMessagesService({
      findProfileById: async () => createPartner(),
      findConversations: async () => [],
      findFollowingProfiles: async () => [],
      findConversationMessages: async (_context, input) => {
        requestedLimits.push(input.limit);

        return Array.from({ length: 31 }, (_, index) => {
          const day = String(31 - index).padStart(2, "0");

          return createMessage(`message-${31 - index}`, `2026-01-${day}T10:00:00.000Z`);
        });
      },
      createMessage: async () => baseMessage(),
      markConversationAsRead: async () => 0
    });

    const result = await service.getConversationHistory(
      {
        accessToken: "token-1",
        userId: "viewer-1"
      },
      "user-2",
      null
    );

    expect(requestedLimits[0]).toBe(31);
    expect(result.items).toHaveLength(30);
    expect(result.items[0]?.id).toBe("message-2");
    expect(result.items[29]?.id).toBe("message-31");
    expect(result.nextCursor).toMatchObject({
      id: "message-2"
    });
  });

  it("ayni mesaj iki kez gelirse tek kopya dondurur", async () => {
    const service = createMessagesService({
      findProfileById: async () => createPartner(),
      findConversations: async () => [],
      findFollowingProfiles: async () => [],
      findConversationMessages: async () => [
        createMessage("message-3", "2026-01-03T10:00:00.000Z"),
        createMessage("message-3", "2026-01-03T10:00:00.000Z"),
        createMessage("message-2", "2026-01-02T10:00:00.000Z")
      ],
      createMessage: async () => baseMessage(),
      markConversationAsRead: async () => 0
    });

    const result = await service.getConversationHistory(
      {
        accessToken: "token-1",
        userId: "viewer-1"
      },
      "user-2",
      null
    );

    expect(result.items.map((item) => item.id)).toEqual(["message-2", "message-3"]);
  });

  it("kendine mesaj gondermeyi engeller", async () => {
    const service = createMessagesService({
      findProfileById: async () => createPartner(),
      findConversations: async () => [],
      findFollowingProfiles: async () => [],
      findConversationMessages: async () => [],
      createMessage: async () => baseMessage(),
      markConversationAsRead: async () => 0
    });

    await expect(
      service.sendMessage(
        {
          accessToken: "token-1",
          userId: "viewer-1"
        },
        {
          receiverId: "viewer-1",
          content: "Merhaba"
        }
      )
    ).rejects.toMatchObject({
      code: "MESSAGE_SELF_NOT_ALLOWED"
    });
  });

  it("mesaj icerigini normalize ederek gonderir", async () => {
    const createMessageMock = vi.fn(async (_context, input) =>
      createMessage("message-10", "2026-01-10T10:00:00.000Z", {
        senderId: "viewer-1",
        receiverId: input.receiverId,
        content: input.content,
        isMine: true,
        isRead: true
      })
    );
    const service = createMessagesService({
      findProfileById: async () => createPartner(),
      findConversations: async () => [],
      findFollowingProfiles: async () => [],
      findConversationMessages: async () => [],
      createMessage: createMessageMock,
      markConversationAsRead: async () => 0
    });

    const result = await service.sendMessage(
      {
        accessToken: "token-1",
        userId: "viewer-1"
      },
      {
        receiverId: "user-2",
        content: "  Selam\r\nDunya\u0000  "
      }
    );

    expect(createMessageMock).toHaveBeenCalledWith(
      {
        accessToken: "token-1",
        userId: "viewer-1"
      },
      {
        receiverId: "user-2",
        content: "Selam\nDunya"
      }
    );
    expect(result.content).toBe("Selam\nDunya");
  });
});