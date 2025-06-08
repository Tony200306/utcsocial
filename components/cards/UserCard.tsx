"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import{  FollowContext } from "../../Context/Context";
import { useContext } from "react";
import useUserStore from "@/store/useUserStore";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

function UserCard({ id, name, username, imgUrl, personType ,isfollowed }: Readonly<Props>) {
  const router = useRouter();
  const {handleFollow ,followStatus } = useContext(FollowContext) ;
  const user = useUserStore((state) => state.user);
  console.log("user", user?._id,id);
  const isFollowed1 = followStatus[id] ?? false;
  return (
    <article className="flex flex-col justify-between gap-4 max-xs:rounded-xl  max-xs:bg-light-3 max-xs:p-4 dark:max-xs:bg-dark-3 xs:flex-row xs:items-center">
      <div className="flex flex-1 items-start justify-start gap-3 xs:items-center">
        <div className="relative h-12 w-12">
          <Image
          unoptimized
            src={imgUrl}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-primary dark:text-light-1">
            {name}
          </h4>
          <p className="text-small-medium text-gray-500 dark:text-gray-1">
            @{username}
          </p>
        </div>
      </div>            

      <Button
    className="min-w-[74px] rounded-lg bg-dark-4 text-[12px] text-light-1 dark:bg-primary-500"
    onClick={() => {
      router.push(`/profile/${id}`);
    }}
  >
    View
  </Button>
  {/* isfollowed là truyền từ rightsidebar sang , đánh dấu là đã follow
  và sẽ không sử dụng ở cái top user chưa follow , isFollowed1 là 
  trạng thái sử dụng từ context */}
  {!isfollowed && !isFollowed1 && (
    <Button
      hidden={user?._id === id}
      className="min-w-[74px] rounded-lg bg-dark-4 text-[12px] text-light-1 dark:bg-primary-500"
      onClick={() => handleFollow(id)}
    >
      {isFollowed1 ? "Unfollow" : "Follow"} 
    </Button>
  )}
    </article>
  );
}

export default UserCard;
