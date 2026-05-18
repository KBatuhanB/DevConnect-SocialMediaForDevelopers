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