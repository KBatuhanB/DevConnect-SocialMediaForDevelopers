import { describe, expect, it, vi } from "vitest";
import { createProfilesService } from "./service";
import type { ProfileView } from "./types";

function createProfile(id = "11111111-1111-1111-1111-111111111111"): ProfileView {
  return {
    id,
    username: "kelami",
    bio: "Merhaba",
    avatarPath: null,
    avatarUrl: null,
    skills: ["TypeScript"],
    stats: {
      followers: 3,
      following: 4,
      posts: 1
    },
    isFollowing: false,
    isOwner: false
  };
}

describe("profiles service", () => {
  it("kendi profilini dondurur", async () => {
    const service = createProfilesService({
      findProfileById: async () => createProfile(),
      updateMyProfile: async () => null,
      followProfile: async () => undefined,
      unfollowProfile: async () => undefined,
      replaceAvatar: async () => null
    });

    await expect(
      service.getMyProfile({
        accessToken: "token-1",
        userId: "11111111-1111-1111-1111-111111111111"
      })
    ).resolves.toMatchObject({
      username: "kelami"
    });
  });

  it("profil guncellerken skill etiketlerini normalize eder", async () => {
    const updateMyProfile = vi.fn(async (_context, input) => ({
      ...createProfile("22222222-2222-2222-2222-222222222222"),
      bio: input.bio,
      skills: input.skills,
      isOwner: true
    }));

    const service = createProfilesService({
      findProfileById: async () => createProfile(),
      updateMyProfile,
      followProfile: async () => undefined,
      unfollowProfile: async () => undefined,
      replaceAvatar: async () => null
    });

    await service.updateMyProfile(
      {
        accessToken: "token-1",
        userId: "22222222-2222-2222-2222-222222222222"
      },
      {
        bio: "  Yeni bio  ",
        skills: [" TypeScript ", "typescript", " React ", ""]
      }
    );

    expect(updateMyProfile).toHaveBeenCalledWith(
      {
        accessToken: "token-1",
        userId: "22222222-2222-2222-2222-222222222222"
      },
      {
        bio: "Yeni bio",
        skills: ["TypeScript", "React"]
      }
    );
  });

  it("kendini takip etmeyi reddeder", async () => {
    const service = createProfilesService({
      findProfileById: async () => createProfile(),
      updateMyProfile: async () => null,
      followProfile: async () => undefined,
      unfollowProfile: async () => undefined,
      replaceAvatar: async () => null
    });

    await expect(
      service.followProfile(
        {
          accessToken: "token-1",
          userId: "33333333-3333-3333-3333-333333333333"
        },
        "33333333-3333-3333-3333-333333333333"
      )
    ).rejects.toMatchObject({
      code: "PROFILE_SELF_FOLLOW_NOT_ALLOWED",
      statusCode: 400
    });
  });

  it("takip sonrasi guncel profili dondurur", async () => {
    const followProfile = vi.fn(async () => undefined);
    const findProfileById = vi
      .fn()
      .mockResolvedValueOnce(createProfile("44444444-4444-4444-4444-444444444444"))
      .mockResolvedValueOnce({
        ...createProfile("44444444-4444-4444-4444-444444444444"),
        isFollowing: true,
        stats: {
          followers: 5,
          following: 4,
          posts: 1
        }
      });

    const service = createProfilesService({
      findProfileById,
      updateMyProfile: async () => null,
      followProfile,
      unfollowProfile: async () => undefined,
      replaceAvatar: async () => null
    });

    await expect(
      service.followProfile(
        {
          accessToken: "token-1",
          userId: "55555555-5555-5555-5555-555555555555"
        },
        "44444444-4444-4444-4444-444444444444"
      )
    ).resolves.toMatchObject({
      isFollowing: true,
      stats: {
        followers: 5
      }
    });

    expect(followProfile).toHaveBeenCalledWith(
      {
        accessToken: "token-1",
        userId: "55555555-5555-5555-5555-555555555555"
      },
      "44444444-4444-4444-4444-444444444444"
    );
  });

  it("avatar yuklemede veri ve tip kontrolu yapar", async () => {
    const replaceAvatar = vi.fn(async () => ({
      ...createProfile("66666666-6666-6666-6666-666666666666"),
      avatarPath: "66666666-6666-6666-6666-666666666666/avatar-1.png",
      avatarUrl:
        "https://example.supabase.co/storage/v1/object/public/avatars/66666666-6666-6666-6666-666666666666/avatar-1.png",
      isOwner: true
    }));

    const service = createProfilesService({
      findProfileById: async () => createProfile("66666666-6666-6666-6666-666666666666"),
      updateMyProfile: async () => null,
      followProfile: async () => undefined,
      unfollowProfile: async () => undefined,
      replaceAvatar
    });

    await expect(
      service.uploadMyAvatar(
        {
          accessToken: "token-1",
          userId: "66666666-6666-6666-6666-666666666666"
        },
        {
          contentType: "image/png",
          dataUrl: "data:image/png;base64,aGVsbG8="
        }
      )
    ).resolves.toMatchObject({
      avatarPath: "66666666-6666-6666-6666-666666666666/avatar-1.png"
    });

    expect(replaceAvatar).toHaveBeenCalledTimes(1);
  });
});