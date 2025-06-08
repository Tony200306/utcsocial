import { getUserByCookies } from "@/apis/user";
import { User } from "@/types/userType";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  hydrateUser: () => void;
  setUser: (user: User) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  saveThread: (threadId: string) => void;
  removeSavedThread: (threadId: string) => void;
  updateProfile: (
    name: string,
    username: string,
    bio: string,
    profilePic: string
  ) => void;
  addRepost: (threadId: string) => void;
  removeRepost: (threadId: string) => void;
  addBlockedUser: (userId: string) => void;
  removeBlockedUser: (userId: string) => void;
  addViewedThread: (threadId: string) => void;
  removeViewedThread: (threadId: string) => void;
  setOnboarded: (status: boolean) => void;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => (
  {
  user: null,
  hydrateUser: async () => {
    try {
      const user = await getUserByCookies();
      set({ user });
    } catch (error) {
      console.error("Failed to hydrate user:", error);
    }
  },
  setUser: (user) => set({ user }),
  updateUser: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),
  followUser: (userId) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, following: [...state.user.following, userId] }
        : null,
    })),
  unfollowUser: (userId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            following: state.user.following.filter((id) => id !== userId),
          }
        : null,
    })),
  saveThread: (threadId) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, saves: [...state.user.saves, threadId] }
        : null,
    })),
  removeSavedThread: (threadId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            saves: state.user.saves.filter((id) => id !== threadId),
          }
        : null,
    })),
  updateProfile: (name, username, bio, profilePic) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, name, username, bio, profilePic }
        : null,
    })),
  addRepost: (threadId) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, reposts: [...state.user.reposts, threadId] }
        : null,
    })),
  removeRepost: (threadId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            reposts: state.user.reposts.filter((id) => id !== threadId),
          }
        : null,
    })),
  addBlockedUser: (userId) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, blockedUsers: [...state.user.blockedUsers, userId] }
        : null,
    })),
  removeBlockedUser: (userId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            blockedUsers: state.user.blockedUsers.filter((id) => id !== userId),
          }
        : null,
    })),
  addViewedThread: (threadId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            viewedThreads: [...state.user.viewedThreads, threadId],
          }
        : null,
    })),
  removeViewedThread: (threadId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            viewedThreads: state.user.viewedThreads.filter(
              (id) => id !== threadId
            ),
          }
        : null,
    })),
  setOnboarded: (status) =>
    set((state) => ({
      user: state.user ? { ...state.user, onboarded: status } : null,
    })),
  logout: () => set({ user: null }),
}));

export default useUserStore;
