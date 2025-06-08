import { getUserByCookies } from "@/apis/user";
import { User } from "@/types/userType";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  user: User | null;
  isHydrated: boolean;
  hydrateUser: () => void;
  setUser: (user: User | null) => void;
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
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isHydrated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

      hydrateUser: async () => {
        try {
          const user = await getUserByCookies();
          set({ user, isHydrated: true });
        } catch (error) {
          console.error("Failed to hydrate user:", error);
          set({ user: null, isHydrated: true });
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
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => { },
          removeItem: () => { },
        };
      }),
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log("An error happened during hydration", error);
          } else {
            state?.setHasHydrated(true);
          }
        };
      },
    }
  )
);

export default useUserStore;
