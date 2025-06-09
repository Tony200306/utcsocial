import useUserStore from "@/store/useUserStore";
import { User } from "@/types/userType";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { followOrUnfollowUser, getUserFollowingById } from "../../apis/user";
import { Button } from "../custom/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";

function ProfileHeader({ data }: Readonly<{ data: User }>) {
  const user = useUserStore((state) => state.user);
  const [followers, setFollowers] = useState<User[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await getUserFollowingById({ id: data._id });
        setFollowers(response);
      } catch (error) {
        console.error("Failed to fetch followers:", error);
      }
    };
    fetchFollowers();
  }, []);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log(followers)
  useEffect(() => {
    // Check if current user is following this profile
    if (user && followers.some(follower => follower._id === user._id)) {
      console.log("User is following this profile", followers,user) ;
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [followers, user]);

  const handleFollowToggle = async () => {
    if (!user || user._id === data._id) return;
    
    setIsLoading(true);
    try {
      await followOrUnfollowUser({ id: data._id });
      setIsFollowing(!isFollowing);
      
      // Update followers list
      if (isFollowing) {
        setFollowers(prev => prev.filter(follower => follower._id !== user._id));
      } else {
        setFollowers(prev => [...prev, user]);
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col justify-start rounded-xl border bg-light-1 px-4 py-5 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-20 object-cover">
            <Image
              unoptimized
              src={data?.profilePic ?? ""}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-lg dark:text-light-1">{data.name}</h2>
            <p className="dark:text-gray-1">@{data.username}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                Người theo dõi ({followers.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg sm:max-w-[425px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-lg">
              <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <DialogDescription className="text-lg font-semibold text-gray-900 dark:text-white">
                  Người theo dõi ({followers.length})
                </DialogDescription>
              </DialogHeader>
              
              <div className="max-h-80 overflow-y-auto">
                {followers.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Chưa có người theo dõi
                  </p>
                ) : (
                  <div className="space-y-3">
                    {followers.map((follower) => (
                      <div
                        key={follower._id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 object-cover">
                            <Image
                              unoptimized
                              src={follower.profilePic ?? ""}
                              alt={follower.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {follower.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              @{follower.username}
                            </p>
                          </div>
                        </div>
                        
                        <Link href={`/profile/${follower._id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Xem
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full">
                    Đóng
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {user && user._id !== data._id && (
            <Button
              onClick={handleFollowToggle}
              disabled={isLoading}
              variant={isFollowing ? "outline" : "default"}
              className={`min-w-[100px] ${
                isFollowing 
                  ? "hover:bg-red-50 hover:text-red-600 hover:border-red-300" 
                  : "bg-black hover:bg-blue-700 text-white"
              }`}
            >
              {isLoading ? "..." : isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
            </Button>
          )}

          {data._id === user?._id && (
            <Link href="/settings/profile">
              <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 hover:bg-dark-2 transition-colors">
                <Image
                  unoptimized
                  src="/assets/edit.svg"
                  alt="edit"
                  width={16}
                  height={16}
                />
                <p className="text-light-2 max-sm:hidden">Chỉnh sửa</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      <p className="mt-6 max-w-lg dark:text-light-2">{data.bio}</p>

      <div className="mt-12 h-0.5 w-full dark:bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
