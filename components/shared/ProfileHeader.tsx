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
import { getUsersFollowingMe } from "../../apis/user";
import { Button } from "../custom/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";

function ProfileHeader({ data }: Readonly<{ data: User }>) {
  const user = useUserStore((state) => state.user);
  const [followers, setFollowers] = useState<User[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await getUsersFollowingMe();
        setFollowers(response);
      } catch (error) {
        console.error("Failed to fetch followers:", error);
      }
    };

    fetchFollowers();
  }, []);
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
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Người theo dõi ({followers.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black p-4 rounded-lg sm:max-w-[425px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <DialogHeader>
                <DialogDescription className="text-white">
                  Người theo dõi bạn
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 m-2 ">
                {followers.map((follower) => (
                  <div
                    key={follower._id}
                    className="flex items-center m-2 gap-3"
                  >
                    <div className="relative size-10 object-cover">
                      <Image
                        unoptimized
                        src={follower.profilePic ?? ""}
                        alt={follower.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {follower.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        @{follower.username}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {data._id === user?._id && (
            <Link href="/settings/profile">
              <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
                <Image
                  unoptimized
                  src="/assets/edit.svg"
                  alt="logout"
                  width={16}
                  height={16}
                />

                <p className="text-light-2  max-sm:hidden">Edit</p>
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
