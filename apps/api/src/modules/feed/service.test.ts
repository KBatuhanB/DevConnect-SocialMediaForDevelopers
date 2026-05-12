import { describe, expect, it } from "vitest";
import { createFeedService } from "./service";

function createFeedItem(id: string, createdAt: string, userId = "user-1") {
  return {
    id,
    userId,
    content: "icerik",
    mediaPath: null,
    mediaUrl: null,
    codeLanguage: null,
    postType: "text" as const,
    createdAt,
    isOwner: userId === "viewer-1",
    author: {
      id: userId,
      username: userId,
      avatarPath: null,
      avatarUrl: null
    },
    stats: {
      likes: 0,
      comments: 0
    }
  };
}

describe("feed service", () => {
  it("takip edilenler ve kullanicinin kendisi icin feed ister", async () => {
    const requestedUserIds: string[][] = [];
    const service = createFeedService({
      findFollowingIds: async () => ["followed-1", "followed-2"],
      findFeedCandidates: async (_context, input) => {
        requestedUserIds.push(input.allowedUserIds);
        return [createFeedItem("post-1", "2026-01-03T10:00:00.000Z", "viewer-1")];
      }
    });

    await expect(
      service.getFeedPage(
        {
          accessToken: "token-1",
          userId: "viewer-1"
        },
        null
      )
    ).resolves.toMatchObject({
      items: [{ id: "post-1" }],
      nextCursor: null
    });

    expect(requestedUserIds[0]).toEqual(["viewer-1", "followed-1", "followed-2"]);
  });

  it("fazla kaydi page size'a gore kirpar ve cursor uretir", async () => {
    const service = createFeedService({
      findFollowingIds: async () => [],
      findFeedCandidates: async () =>
        Array.from({ length: 21 }, (_, index) =>
          createFeedItem(
            `post-${index + 1}`,
            `2026-01-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`,
            "viewer-1"
          )
        )
    });

    const result = await service.getFeedPage(
      {
        accessToken: "token-1",
        userId: "viewer-1"
      },
      null
    );

    expect(result.items).toHaveLength(20);
    expect(result.nextCursor).toMatchObject({
      id: "post-20"
    });
  });

  it("ayni post tekrar gelirse tek kopya gosterir", async () => {
    const service = createFeedService({
      findFollowingIds: async () => [],
      findFeedCandidates: async () => [
        createFeedItem("post-1", "2026-01-03T10:00:00.000Z", "viewer-1"),
        createFeedItem("post-1", "2026-01-03T10:00:00.000Z", "viewer-1"),
        createFeedItem("post-2", "2026-01-02T10:00:00.000Z", "viewer-1")
      ]
    });

    const result = await service.getFeedPage(
      {
        accessToken: "token-1",
        userId: "viewer-1"
      },
      null
    );

    expect(result.items).toHaveLength(2);
    expect(result.items.map((item) => item.id)).toEqual(["post-1", "post-2"]);
  });
});