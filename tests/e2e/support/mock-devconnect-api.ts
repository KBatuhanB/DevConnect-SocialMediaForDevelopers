import type { BrowserContext, Page, Route } from "@playwright/test";
import { phase12TestConfig } from "../../config/phase-12.config";

type PostType = "text" | "code" | "image";

type MockProfileView = {
  id: string;
  username: string;
  bio: string;
  avatarPath: string | null;
  avatarUrl: string | null;
  skills: string[];
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing: boolean;
  isOwner: boolean;
};

type MockPostView = {
  id: string;
  userId: string;
  content: string;
  mediaPath: string | null;
  mediaUrl: string | null;
  codeLanguage: string | null;
  postType: PostType;
  createdAt: string;
  isOwner: boolean;
  isLiked: boolean;
  stats: {
    likes: number;
    comments: number;
  };
};

type MockPostCommentRecord = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
};

type MockPostCommentView = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
  author: {
    id: string;
    username: string;
    avatarPath: string | null;
    avatarUrl: string | null;
  };
};

type MockPostLikeRecord = {
  postId: string;
  userId: string;
};

type MockMessageView = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  isMine: boolean;
};

type MockApiOptions = {
  disableRealtime?: boolean;
  failFirstMessageSend?: boolean;
  registerRequiresEmailVerification?: boolean;
};

const requestId = "phase12-e2e";
const viewerId = phase12TestConfig.ids.viewer;
const peerId = phase12TestConfig.ids.peer;
const strangerId = phase12TestConfig.ids.stranger;
const viewerEmail = "viewer@devconnect.test";
const viewerUsername = "batuhan_dev";
const peerUsername = "peer_engineer";
const strangerUsername = "design_ops";

function buildCorsHeaders() {
  return {
    "access-control-allow-origin": phase12TestConfig.e2e.baseUrl,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "access-control-allow-headers": "Content-Type"
  };
}

function buildSuccessResponse(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return {
    status,
    headers: {
      ...buildCorsHeaders(),
      "content-type": "application/json",
      ...extraHeaders
    },
    body: JSON.stringify({
      success: true,
      data,
      meta: {
        requestId
      }
    })
  };
}

function buildErrorResponse(status: number, code: string, message: string) {
  return {
    status,
    headers: {
      ...buildCorsHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      success: false,
      error: {
        code,
        message,
        requestId
      }
    })
  };
}

function readRequestBody<T>(route: Route) {
  const rawBody = route.request().postData();

  return rawBody ? (JSON.parse(rawBody) as T) : ({} as T);
}

function hasSession(route: Route) {
  return route.request().headers().cookie?.includes(`${phase12TestConfig.e2e.authCookie.name}=`) ?? false;
}

function buildAuthCookieHeader(value: string, maxAgeSeconds?: number) {
  return [
    `${phase12TestConfig.e2e.authCookie.name}=${value}`,
    "Path=/",
    "SameSite=Lax",
    ...(typeof maxAgeSeconds === "number" ? [`Max-Age=${maxAgeSeconds}`] : [])
  ].join("; ");
}

function buildViewerProfile(state: MockState): MockProfileView {
  return {
    id: viewerId,
    username: viewerUsername,
    bio: state.viewer.bio,
    avatarPath: null,
    avatarUrl: null,
    skills: state.viewer.skills,
    stats: {
      followers: 2,
      following: Number(state.peer.isFollowing) + Number(state.stranger.isFollowing),
      posts: state.posts.filter((post) => post.userId === viewerId).length
    },
    isFollowing: false,
    isOwner: true
  };
}

function buildPeerProfile(state: MockState): MockProfileView {
  return {
    id: peerId,
    username: peerUsername,
    bio: state.peer.bio,
    avatarPath: null,
    avatarUrl: null,
    skills: state.peer.skills,
    stats: {
      followers: state.peer.isFollowing ? 1 : 0,
      following: 0,
      posts: state.posts.filter((post) => post.userId === peerId).length
    },
    isFollowing: state.peer.isFollowing,
    isOwner: false
  };
}

function buildStrangerProfile(state: MockState): MockProfileView {
  return {
    id: strangerId,
    username: strangerUsername,
    bio: state.stranger.bio,
    avatarPath: null,
    avatarUrl: null,
    skills: state.stranger.skills,
    stats: {
      followers: state.stranger.isFollowing ? 1 : 0,
      following: 3,
      posts: state.posts.filter((post) => post.userId === strangerId).length
    },
    isFollowing: state.stranger.isFollowing,
    isOwner: false
  };
}

function buildProfileById(state: MockState, profileId: string) {
  if (profileId === viewerId) {
    return buildViewerProfile(state);
  }

  if (profileId === peerId) {
    return buildPeerProfile(state);
  }

  if (profileId === strangerId) {
    return buildStrangerProfile(state);
  }

  return null;
}

function buildPostStats(state: MockState, postId: string) {
  return {
    likes: state.likes.filter((like) => like.postId === postId).length,
    comments: state.comments.filter((comment) => comment.postId === postId).length
  };
}

function buildPostView(state: MockState, post: MockPostView): MockPostView {
  return {
    ...post,
    isOwner: post.userId === viewerId,
    isLiked: state.likes.some((like) => like.postId === post.id && like.userId === viewerId),
    stats: buildPostStats(state, post.id)
  };
}

function buildCommentAuthor(state: MockState, userId: string) {
  const profile = buildProfileById(state, userId);

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    username: profile.username,
    avatarPath: profile.avatarPath,
    avatarUrl: profile.avatarUrl
  };
}

function buildCommentView(state: MockState, comment: MockPostCommentRecord): MockPostCommentView | null {
  const author = buildCommentAuthor(state, comment.userId);

  if (!author) {
    return null;
  }

  return {
    id: comment.id,
    postId: comment.postId,
    userId: comment.userId,
    content: comment.content,
    createdAt: comment.createdAt,
    isOwner: comment.userId === viewerId,
    author
  };
}

function buildCommentsByPostId(state: MockState, postId: string) {
  return state.comments
    .filter((comment) => comment.postId === postId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
    .map((comment) => buildCommentView(state, comment))
    .filter((comment): comment is MockPostCommentView => comment !== null);
}

function getSearchMatchPriority(username: string, normalizedQuery: string) {
  const normalizedUsername = username.toLowerCase();

  if (normalizedUsername === normalizedQuery) {
    return 0;
  }

  if (normalizedUsername.startsWith(normalizedQuery)) {
    return 1;
  }

  if (normalizedUsername.includes(normalizedQuery)) {
    return 2;
  }

  return 3;
}

function buildProfileSearchResults(state: MockState, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length === 0) {
    return [];
  }

  return [buildViewerProfile(state), buildPeerProfile(state), buildStrangerProfile(state)]
    .filter((profile) => profile.username.toLowerCase().includes(normalizedQuery))
    .sort((left, right) => {
      const priorityDifference =
        getSearchMatchPriority(left.username, normalizedQuery) - getSearchMatchPriority(right.username, normalizedQuery);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return left.username.localeCompare(right.username, "tr", { sensitivity: "base" });
    })
    .map((profile) => ({
      id: profile.id,
      username: profile.username,
      avatarUrl: profile.avatarUrl
    }));
}

function buildViewerSummary(state: MockState) {
  const profile = buildViewerProfile(state);

  return {
    id: profile.id,
    username: profile.username,
    bio: profile.bio,
    avatarPath: profile.avatarPath,
    skills: profile.skills
  };
}

function buildFeed(state: MockState, mode: "following" | "global") {
  return state.posts
    .filter((post) => {
      if (mode === "global") {
        return true;
      }

      return post.userId === viewerId || (state.peer.isFollowing && post.userId === peerId);
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id))
    .map((post) => ({
      ...buildPostView(state, post),
      author:
        post.userId === viewerId
          ? {
              id: viewerId,
              username: viewerUsername,
              avatarPath: null,
              avatarUrl: null
            }
          : {
              id: peerId,
              username: peerUsername,
              avatarPath: null,
              avatarUrl: null
            }
    }));
}

function buildMessagePartner(state: MockState, profileId: string) {
  const profile = buildProfileById(state, profileId);

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    username: profile.username,
    avatarPath: profile.avatarPath,
    avatarUrl: profile.avatarUrl
  };
}

function buildConversationList(state: MockState) {
  return [peerId, strangerId]
    .map((partnerId) => {
      const partnerMessages = state.messages
        .filter((message) => {
          const ids = [message.senderId, message.receiverId];

          return ids.includes(viewerId) && ids.includes(partnerId);
        })
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id));
      const lastMessage = partnerMessages[0] ?? null;
      const partner = buildMessagePartner(state, partnerId);

      if (!lastMessage || !partner) {
        return null;
      }

      return {
        partner,
        lastMessage,
        unreadCount: state.messages.filter(
          (message) => message.senderId === partnerId && message.receiverId === viewerId && !message.isRead
        ).length,
        updatedAt: lastMessage.createdAt
      };
    })
    .filter((conversation): conversation is NonNullable<typeof conversation> => conversation !== null)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.partner.username.localeCompare(right.partner.username));
}

function buildFollowingProfiles(state: MockState) {
  const recentPartnerIds = new Set(buildConversationList(state).map((conversation) => conversation.partner.id));

  return [state.peer.isFollowing ? buildPeerProfile(state) : null, state.stranger.isFollowing ? buildStrangerProfile(state) : null]
    .filter((profile): profile is MockProfileView => profile !== null)
    .filter((profile) => !recentPartnerIds.has(profile.id))
    .map((profile) => ({
      id: profile.id,
      username: profile.username,
      avatarPath: profile.avatarPath,
      avatarUrl: profile.avatarUrl
    }));
}

function buildMessageHistory(state: MockState, partnerId: string) {
  return state.messages
    .filter((message) => {
      const ids = [message.senderId, message.receiverId];

      return ids.includes(viewerId) && ids.includes(partnerId);
    })
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id));
}

type MockState = {
  viewer: {
    bio: string;
    skills: string[];
  };
  peer: {
    bio: string;
    skills: string[];
    isFollowing: boolean;
  };
  stranger: {
    bio: string;
    skills: string[];
    isFollowing: boolean;
  };
  posts: MockPostView[];
  likes: MockPostLikeRecord[];
  comments: MockPostCommentRecord[];
  messages: MockMessageView[];
  nextPostNumber: number;
  nextCommentNumber: number;
  nextMessageNumber: number;
  failNextMessageSend: boolean;
};

function createMockState(options: MockApiOptions): MockState {
  return {
    viewer: {
      bio: "TypeScript ve React odakli gelistirici.",
      skills: ["TypeScript", "React"]
    },
    peer: {
      bio: "Node.js ve veri modelleme uzerinde calisiyor.",
      skills: ["Node.js", "SQL"],
      isFollowing: false
    },
    stranger: {
      bio: "Tasarim sistemleri ve urun iletisimi uzerinde calisiyor.",
      skills: ["Product Design", "CSS"],
      isFollowing: true
    },
    posts: [
      {
        id: "post-peer-1",
        userId: peerId,
        content: "Node tarafinda sade repository desenini kullanmak isi hizlandirdi.",
        mediaPath: null,
        mediaUrl: null,
        codeLanguage: null,
        postType: "text",
        createdAt: "2026-05-09T10:00:00.000Z",
        isOwner: false,
        isLiked: false,
        stats: {
          likes: 0,
          comments: 0
        }
      }
    ],
    likes: [],
    comments: [],
    messages: [
      {
        id: "message-1",
        senderId: peerId,
        receiverId: viewerId,
        content: "Realtime tarafini test etmeye hazir misin?",
        isRead: false,
        createdAt: "2026-05-09T09:30:00.000Z",
        isMine: false
      }
    ],
    nextPostNumber: 2,
    nextCommentNumber: 1,
    nextMessageNumber: 2,
    failNextMessageSend: options.failFirstMessageSend ?? false
  };
}

export async function authenticateBrowserContext(context: BrowserContext) {
  await context.addCookies([
    {
      name: phase12TestConfig.e2e.authCookie.name,
      value: phase12TestConfig.e2e.authCookie.value,
      url: phase12TestConfig.e2e.baseUrl
    }
  ]);
}

export async function installMockDevConnectApi(page: Page, options: MockApiOptions = {}) {
  const state = createMockState(options);

  await page.route(`${phase12TestConfig.e2e.apiBaseUrl}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    if (method === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: buildCorsHeaders()
      });
      return;
    }

    const isAuthenticated = hasSession(route);

    if (path === "/auth/register" && method === "POST") {
      const input = readRequestBody<{ username: string; email: string }>(route);

      await route.fulfill(
        buildSuccessResponse(
          {
            user: {
              id: viewerId,
              email: input.email,
              username: input.username
            },
            requiresEmailVerification: options.registerRequiresEmailVerification ?? false
          },
          201,
          options.registerRequiresEmailVerification
            ? {}
            : {
                "set-cookie": buildAuthCookieHeader(phase12TestConfig.e2e.authCookie.value)
              }
        )
      );
      return;
    }

    if (path === "/auth/login" && method === "POST") {
      await route.fulfill(
        buildSuccessResponse(
          {
            user: {
              id: viewerId,
              email: viewerEmail,
              username: viewerUsername
            },
            requiresEmailVerification: false
          },
          200,
          {
            "set-cookie": buildAuthCookieHeader(phase12TestConfig.e2e.authCookie.value)
          }
        )
      );
      return;
    }

    if (path === "/auth/logout" && method === "POST") {
      await route.fulfill(
        buildSuccessResponse(
          {
            message: "Oturum kapatildi."
          },
          200,
          {
            "set-cookie": buildAuthCookieHeader("", 0)
          }
        )
      );
      return;
    }

    if (path === "/api/session" && method === "GET") {
      if (!isAuthenticated) {
        await route.fulfill(buildErrorResponse(401, "AUTH_REQUIRED", "Bu islem icin giris yapmalisin."));
        return;
      }

      await route.fulfill(
        buildSuccessResponse({
          user: {
            id: viewerId,
            email: viewerEmail,
            username: viewerUsername
          }
        })
      );
      return;
    }

    if (!isAuthenticated) {
      await route.fulfill(buildErrorResponse(401, "AUTH_REQUIRED", "Bu islem icin giris yapmalisin."));
      return;
    }

    if (path === "/api/me" && method === "GET") {
      await route.fulfill(
        buildSuccessResponse({
          profile: buildViewerSummary(state)
        })
      );
      return;
    }

    if (path === "/api/profiles/me" && method === "GET") {
      await route.fulfill(
        buildSuccessResponse({
          profile: buildViewerProfile(state)
        })
      );
      return;
    }

    if (path === "/api/profiles/me" && method === "PATCH") {
      const input = readRequestBody<{ bio: string; skills: string[] }>(route);
      state.viewer.bio = input.bio;
      state.viewer.skills = input.skills;

      await route.fulfill(
        buildSuccessResponse({
          profile: buildViewerProfile(state)
        })
      );
      return;
    }

    if (path === "/api/profiles/search" && method === "GET") {
      await route.fulfill(
        buildSuccessResponse({
          profiles: buildProfileSearchResults(state, url.searchParams.get("query") ?? "")
        })
      );
      return;
    }

    if (path === "/api/feed" && method === "GET") {
      const mode = url.searchParams.get("mode") === "global" ? "global" : "following";

      await route.fulfill(
        buildSuccessResponse({
          page: {
            items: buildFeed(state, mode),
            nextCursor: null
          }
        })
      );
      return;
    }

    if (path === "/api/posts" && method === "POST") {
      const input = readRequestBody<{ content: string; postType: PostType; codeLanguage: string | null }>(route);
      const nextPost: MockPostView = {
        id: `post-viewer-${state.nextPostNumber}`,
        userId: viewerId,
        content: input.content,
        mediaPath: null,
        mediaUrl: null,
        codeLanguage: input.codeLanguage,
        postType: input.postType,
        createdAt: `2026-05-09T10:${String(state.nextPostNumber).padStart(2, "0")}:00.000Z`,
        isOwner: true,
        isLiked: false,
        stats: {
          likes: 0,
          comments: 0
        }
      };

      state.nextPostNumber += 1;
      state.posts.unshift(nextPost);

      await route.fulfill(
        buildSuccessResponse({
          post: buildPostView(state, nextPost)
        }, 201)
      );
      return;
    }

    if (path.startsWith("/api/posts/") && path.endsWith("/likes")) {
      const postId = path.split("/")[3];
      const post = state.posts.find((currentPost) => currentPost.id === postId);

      if (!post) {
        await route.fulfill(buildErrorResponse(404, "POST_NOT_FOUND", "Paylasim kaydi bulunamadi."));
        return;
      }

      if (method === "POST") {
        if (!state.likes.some((like) => like.postId === postId && like.userId === viewerId)) {
          state.likes.push({
            postId,
            userId: viewerId
          });
        }
      }

      if (method === "DELETE") {
        state.likes = state.likes.filter((like) => !(like.postId === postId && like.userId === viewerId));
      }

      await route.fulfill(
        buildSuccessResponse({
          post: buildPostView(state, post)
        })
      );
      return;
    }

    if (path.startsWith("/api/posts/") && path.endsWith("/comments") && method === "GET") {
      const postId = path.split("/")[3];
      const post = state.posts.find((currentPost) => currentPost.id === postId);

      if (!post) {
        await route.fulfill(buildErrorResponse(404, "POST_NOT_FOUND", "Paylasim kaydi bulunamadi."));
        return;
      }

      await route.fulfill(
        buildSuccessResponse({
          comments: buildCommentsByPostId(state, postId)
        })
      );
      return;
    }

    if (path.startsWith("/api/posts/") && path.endsWith("/comments") && method === "POST") {
      const postId = path.split("/")[3];
      const post = state.posts.find((currentPost) => currentPost.id === postId);
      const input = readRequestBody<{ content: string }>(route);

      if (!post) {
        await route.fulfill(buildErrorResponse(404, "POST_NOT_FOUND", "Paylasim kaydi bulunamadi."));
        return;
      }

      if (input.content.trim().length === 0) {
        await route.fulfill(buildErrorResponse(400, "POST_COMMENT_CONTENT_REQUIRED", "Yorum bos olamaz."));
        return;
      }

      const nextComment: MockPostCommentRecord = {
        id: `comment-${state.nextCommentNumber}`,
        postId,
        userId: viewerId,
        content: input.content.trim(),
        createdAt: `2026-05-09T12:${String(state.nextCommentNumber).padStart(2, "0")}:00.000Z`
      };

      state.nextCommentNumber += 1;
      state.comments.push(nextComment);

      await route.fulfill(
        buildSuccessResponse({
          comment: buildCommentView(state, nextComment),
          post: buildPostView(state, post)
        }, 201)
      );
      return;
    }

    if (path === "/api/messages/realtime-auth" && method === "GET") {
      if (options.disableRealtime) {
        await route.fulfill(buildErrorResponse(500, "REALTIME_DISABLED", "Realtime testte bilerek kapatildi."));
        return;
      }

      await route.fulfill(
        buildSuccessResponse({
          auth: {
            accessToken: phase12TestConfig.e2e.authCookie.value,
            userId: viewerId
          }
        })
      );
      return;
    }

    if (path === "/api/messages" && method === "GET") {
      await route.fulfill(
        buildSuccessResponse({
          conversations: buildConversationList(state),
          followingProfiles: buildFollowingProfiles(state)
        })
      );
      return;
    }

    if (path === "/api/messages" && method === "POST") {
      if (state.failNextMessageSend) {
        state.failNextMessageSend = false;
        await route.fulfill(buildErrorResponse(500, "MESSAGE_CREATE_FAILED", "Mesaj su an gonderilemedi."));
        return;
      }

      const input = readRequestBody<{ receiverId: string; content: string }>(route);

      if (!buildProfileById(state, input.receiverId)) {
        await route.fulfill(buildErrorResponse(404, "PROFILE_NOT_FOUND", "Profil bulunamadi."));
        return;
      }

      const nextMessage: MockMessageView = {
        id: `message-${state.nextMessageNumber}`,
        senderId: viewerId,
        receiverId: input.receiverId,
        content: input.content.trim(),
        isRead: false,
        createdAt: `2026-05-09T11:${String(state.nextMessageNumber).padStart(2, "0")}:00.000Z`,
        isMine: true
      };

      state.nextMessageNumber += 1;
      state.messages.push(nextMessage);

      await route.fulfill(
        buildSuccessResponse({
          message: nextMessage
        }, 201)
      );
      return;
    }

    if (path.startsWith("/api/messages/conversations/") && method === "GET") {
      const partnerId = path.split("/")[4];
      const partner = buildMessagePartner(state, partnerId);

      if (!partner) {
        await route.fulfill(buildErrorResponse(404, "PROFILE_NOT_FOUND", "Profil bulunamadi."));
        return;
      }

      await route.fulfill(
        buildSuccessResponse({
          page: {
            partner,
            items: buildMessageHistory(state, partnerId),
            nextCursor: null
          }
        })
      );
      return;
    }

    if (path.startsWith("/api/messages/conversations/") && path.endsWith("/read") && method === "POST") {
      const partnerId = path.split("/")[4];

      if (!buildProfileById(state, partnerId)) {
        await route.fulfill(buildErrorResponse(404, "PROFILE_NOT_FOUND", "Profil bulunamadi."));
        return;
      }

      const unreadMessages = state.messages.filter(
        (message) => message.senderId === partnerId && message.receiverId === viewerId && !message.isRead
      );

      for (const message of unreadMessages) {
        message.isRead = true;
      }

      await route.fulfill(
        buildSuccessResponse({
          result: {
            updatedCount: unreadMessages.length
          }
        })
      );
      return;
    }

    if (path.startsWith("/api/profiles/") && path.endsWith("/follow")) {
      const profileId = path.split("/")[3];

      if (profileId !== peerId) {
        await route.fulfill(buildErrorResponse(404, "PROFILE_NOT_FOUND", "Profil bulunamadi."));
        return;
      }

      state.peer.isFollowing = method === "POST";

      await route.fulfill(
        buildSuccessResponse({
          profile: buildPeerProfile(state)
        })
      );
      return;
    }

    if (path.startsWith("/api/profiles/") && path.endsWith("/posts") && method === "GET") {
      const profileId = path.split("/")[3];
      const posts = state.posts
        .filter((post) => post.userId === profileId)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id))
        .map((post) => buildPostView(state, post));

      await route.fulfill(
        buildSuccessResponse({
          posts
        })
      );
      return;
    }

    if (path.startsWith("/api/profiles/") && method === "GET") {
      const profileId = path.split("/")[3];
      const profile = buildProfileById(state, profileId);

      if (!profile) {
        await route.fulfill(buildErrorResponse(404, "PROFILE_NOT_FOUND", "Profil bulunamadi."));
        return;
      }

      await route.fulfill(
        buildSuccessResponse({
          profile
        })
      );
      return;
    }

    await route.fulfill(buildErrorResponse(404, "MOCK_ROUTE_NOT_FOUND", `Mock route bulunamadi: ${method} ${path}`));
  });
}