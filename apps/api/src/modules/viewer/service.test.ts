import { describe, expect, it } from "vitest";
import { createViewerService } from "./service";

describe("viewer service", () => {
  it("profil varsa onu dondurur", async () => {
    const service = createViewerService({
      findMyProfile: async () => ({
        id: "user-1",
        username: "kelami",
        bio: "hello",
        avatarPath: null,
        skills: ["ts"]
      })
    });

    await expect(
      service.getMyProfile({
        accessToken: "token-1",
        userId: "user-1"
      })
    ).resolves.toMatchObject({
      username: "kelami"
    });
  });

  it("profil yoksa kontrollu hata firlatir", async () => {
    const service = createViewerService({
      findMyProfile: async () => null
    });

    await expect(
      service.getMyProfile({
        accessToken: "token-1",
        userId: "missing-user"
      })
    ).rejects.toMatchObject({
      code: "VIEWER_PROFILE_NOT_FOUND",
      statusCode: 404
    });
  });
});