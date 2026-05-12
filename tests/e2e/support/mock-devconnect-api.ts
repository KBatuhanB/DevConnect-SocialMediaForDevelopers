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
const viewerEmail = "viewer@devconnect.test";
const viewerUsername = "batuhan_dev";
const peerUsername = "peer_engineer";

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
      following: state.peer.isFollowing ? 1 : 0,
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

function buildProfileById(state: MockState, profileId: string) {
  if (profileId === viewerId) {
    return buildViewerProfile(state);
  }

  if (profileId === peerId) {
    return buildPeerProfile(state);
  }

  return null;
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

function buildFeed(state: MockState) {
  return state.posts
    .filter((post) => post.userId === viewerId || (state.peer.isFollowing && post.userId === peerId))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id))
    .map((post) => ({
      ...post,
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
            },
      stats: {
        likes: 0,
        comments: 0
      }
    }));
}

function buildConversationList(state: MockState) {
  const messages = state.messages
    .filter((message) => {
      const ids = [message.senderId, message.receiverId];

      return ids.includes(viewerId) && ids.includes(peerId);
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id));
  const lastMessage = messages[0] ?? null;
  const unreadCount = state.messages.filter(
    (message) => message.senderId === peerId && message.receiverId === viewerId && !message.isRead
  ).length;

  return lastMessage
    ? [
        {
          partner: {
            id: peerId,
            username: peerUsername,
            avatarPath: null,
            avatarUrl: null
          },
          lastMessage,
          unreadCount,
          updatedAt: lastMessage.createdAt
        }
      ]
    : [];
}

function buildMessageHistory(state: MockState) {
  return state.messages
    .filter((message) => {
      const ids = [message.senderId, message.receiverId];

      return ids.includes(viewerId) && ids.includes(peerId);
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
  posts: MockPostView[];
  messages: MockMessageView[];
  nextPostNumber: number;
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
        isOwner: false
      }
    ],
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

    if (path === "/api/feed" && method === "GET") {
      await route.fulfill(
        buildSuccessResponse({
          page: {
            items: buildFeed(state),
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
        isOwner: true
      };

      state.nextPostNumber += 1;
      state.posts.unshift(nextPost);

      await route.fulfill(
        buildSuccessResponse({
          post: nextPost
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
          conversations: buildConversationList(state)
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

    if (path === `/api/messages/conversations/${peerId}` && method === "GET") {
      await route.fulfill(
        buildSuccessResponse({
          page: {
            partner: {
              id: peerId,
              username: peerUsername,
              avatarPath: null,
              avatarUrl: null
            },
            items: buildMessageHistory(state),
            nextCursor: null
          }
        })
      );
      return;
    }

    if (path === `/api/messages/conversations/${peerId}/read` && method === "POST") {
      const unreadMessages = state.messages.filter(
        (message) => message.senderId === peerId && message.receiverId === viewerId && !message.isRead
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
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id));

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