export type ViewerProfile = {
  id: string;
  username: string;
  bio: string;
  avatarPath: string | null;
  skills: string[];
};

export type ViewerContext = {
  accessToken: string;
  userId: string;
};