// contexts/FollowContext.tsx
import { followOrUnfollowUser, getUserByCookies } from "@/apis/user";
import useUserStore from "@/store/useUserStore";
import { User } from "@/types/userType";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

// Định nghĩa kiểu của context
interface FollowContextProps {
  handleFollow?: (id: string, isFollowed: boolean) => void;
  followStatus?: any;
}

// Tạo context
export const FollowContext = createContext<FollowContextProps | null>(null);

// Custom hook để sử dụng context,Đoạn này có thể không dùng , nó sẽ báo lỗi nếu như FollowProvider không bọc component
// Sẽ báo lỗi nếu dùng với lớp cháu ( gián tiếp)
export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error("useFollow must be used within a FollowProvider");
  }
  return context;
};

// Tạo Provider
export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({}); // Lưu trạng thái của từng người đăng bài
  const { mutate: followingOrUnfollowingThread } = useMutation(
    followOrUnfollowUser,
    {
      onSuccess: (data: { user: User }) => {},
      onError: (error: any) => {
        console.error("Error updating user:", error);
      },
    }
  );

  const user = useUserStore((state) => state.user);
  const { data: userData } = useQuery({
    queryKey: ["user", user],
    queryFn: () => getUserByCookies(),
    enabled: !!user,
  });

  useEffect(() => {
    if (userData?.following) {
      const updatedFollowStatus = userData.following.reduce(
        (acc, user) => {
          acc[user] = true; // Đánh dấu user này đã được follow
          return acc;
        },
        {} as Record<string, boolean>
      );
      setFollowStatus(updatedFollowStatus);
    }
  }, [userData]);

  // Hàm để follow hoặc unfollow
  const handleFollow = (id: string, isFollowed: boolean) => {
    setFollowStatus((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? !isFollowed : !prev[id], // Toggle trạng thái follow
    }));
    followingOrUnfollowingThread({ id });
  };
  return (
    <FollowContext.Provider value={{ handleFollow, followStatus }}>
      {children}
    </FollowContext.Provider>
  );
};
