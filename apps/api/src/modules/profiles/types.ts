export type ProfilesContext = {
  accessToken: string;
  userId: string;
};

export type ProfileStats = {
  followers: number;
  following: number;
  posts: number;
};

export type ProfileView = {
  id: string;
  username: string;
  bio: string;
  avatarPath: string | null;
  avatarUrl: string | null;
  skills: string[];
  stats: ProfileStats;
  isFollowing: boolean;
  isOwner: boolean;
};

export type ProfileSearchItem = {
  id: string;
  username: string;
  avatarUrl: string | null;
};

export type UpdateMyProfileInput = {
  bio: string;
  skills: string[];
};

export type UploadAvatarInput = {
  contentType: string;
  dataUrl: string;
};

export type ReplaceAvatarInput = {
  contentType: string;
  currentAvatarPath: string | null;
  nextAvatarPath: string;
  fileBuffer: Buffer;
};

export type ProfilesRepository = {
  findProfileById: (context: ProfilesContext, profileId: string) => Promise<ProfileView | null>;
  searchProfiles: (context: ProfilesContext, query: string, limit: number) => Promise<ProfileSearchItem[]>;
  updateMyProfile: (context: ProfilesContext, input: UpdateMyProfileInput) => Promise<ProfileView | null>;
  followProfile: (context: ProfilesContext, profileId: string) => Promise<void>;
  unfollowProfile: (context: ProfilesContext, profileId: string) => Promise<void>;
  replaceAvatar: (context: ProfilesContext, input: ReplaceAvatarInput) => Promise<ProfileView | null>;
};