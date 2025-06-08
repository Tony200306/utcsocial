export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  profilePic: string;
  onboarded: boolean;
  followers: string[];
  following: string[];
  role: string;
  accountStatus: string;
  viewedThreads: string[];
  saves: string[];
  reposts: string[];
  blockedUsers: string[];
  createdAt: string;
  updatedAt: string;
}
