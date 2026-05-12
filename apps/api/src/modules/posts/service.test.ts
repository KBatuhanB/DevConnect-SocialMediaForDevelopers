import { describe, expect, it, vi } from "vitest";
import { createPostsService } from "./service";
import type { PostView } from "./types";

function createPost(overrides: Partial<PostView> = {}): PostView {
  return {
    id: "77777777-7777-7777-7777-777777777777",
    userId: "11111111-1111-1111-1111-111111111111",
    content: "Merhaba dunya",
    mediaPath: null,
    mediaUrl: null,
    codeLanguage: null,
    postType: "text",
    createdAt: new Date().toISOString(),
    isOwner: true,
    ...overrides
  };
}

describe("posts service", () => {
  it("text post icin icerigi normalize eder", async () => {
    const createPostRepository = vi.fn(async (_context, input) => createPost({ content: input.content }));
    const service = createPostsService({
      findPostsByProfileId: async () => [],
      findPostById: async () => null,
      createPost: createPostRepository,
      deletePost: async () => undefined
    });

    await service.createPost(
      {
        accessToken: "token-1",
        userId: "11111111-1111-1111-1111-111111111111"
      },
      {
        postType: "text",
        content: "  Merhaba\r\nDunya  ",
        codeLanguage: null,
        media: null
      }
    );

    expect(createPostRepository).toHaveBeenCalledWith(
      {
        accessToken: "token-1",
        userId: "11111111-1111-1111-1111-111111111111"
      },
      expect.objectContaining({
        content: "Merhaba\nDunya",
        codeLanguage: null,
        media: null,
        postType: "text"
      })
    );
  });

  it("image post icin medya bufferi hazirlar", async () => {
    const createPostRepository = vi.fn(async () => createPost({ postType: "image", mediaPath: "user/post-1.png" }));
    const service = createPostsService({
      findPostsByProfileId: async () => [],
      findPostById: async () => null,
      createPost: createPostRepository,
      deletePost: async () => undefined
    });

    await service.createPost(
      {
        accessToken: "token-1",
        userId: "22222222-2222-2222-2222-222222222222"
      },
      {
        postType: "image",
        content: "",
        codeLanguage: null,
        media: {
          contentType: "image/png",
          dataUrl: "data:image/png;base64,aGVsbG8="
        }
      }
    );

    expect(createPostRepository).toHaveBeenCalledWith(
      {
        accessToken: "token-1",
        userId: "22222222-2222-2222-2222-222222222222"
      },
      expect.objectContaining({
        media: expect.objectContaining({
          contentType: "image/png",
          mediaPath: expect.stringContaining("22222222-2222-2222-2222-222222222222/post-")
        }),
        postType: "image"
      })
    );
  });

  it("bos text postu reddeder", async () => {
    const service = createPostsService({
      findPostsByProfileId: async () => [],
      findPostById: async () => null,
      createPost: async () => null,
      deletePost: async () => undefined
    });

    await expect(
      service.createPost(
        {
          accessToken: "token-1",
          userId: "11111111-1111-1111-1111-111111111111"
        },
        {
          postType: "text",
          content: "   ",
          codeLanguage: null,
          media: null
        }
      )
    ).rejects.toMatchObject({
      code: "POST_CONTENT_REQUIRED",
      statusCode: 400
    });
  });

  it("baska kullanicinin postunu silmeyi reddeder", async () => {
    const service = createPostsService({
      findPostsByProfileId: async () => [],
      findPostById: async () => createPost({ isOwner: false, userId: "other-user" }),
      createPost: async () => null,
      deletePost: async () => undefined
    });

    await expect(
      service.deleteMyPost(
        {
          accessToken: "token-1",
          userId: "11111111-1111-1111-1111-111111111111"
        },
        "77777777-7777-7777-7777-777777777777"
      )
    ).rejects.toMatchObject({
      code: "POST_DELETE_FORBIDDEN",
      statusCode: 403
    });
  });

  it("kendi postunu silebilir", async () => {
    const deletePostRepository = vi.fn(async () => undefined);
    const service = createPostsService({
      findPostsByProfileId: async () => [],
      findPostById: async () => createPost(),
      createPost: async () => null,
      deletePost: deletePostRepository
    });

    await expect(
      service.deleteMyPost(
        {
          accessToken: "token-1",
          userId: "11111111-1111-1111-1111-111111111111"
        },
        "77777777-7777-7777-7777-777777777777"
      )
    ).resolves.toMatchObject({
      id: "77777777-7777-7777-7777-777777777777"
    });

    expect(deletePostRepository).toHaveBeenCalled();
  });
});