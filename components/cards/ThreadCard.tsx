import { createConversation } from "@/apis/conversation";
import { likeOrUnlikeThread } from "@/apis/threads";
import { FollowContext } from "@/Context/Context";
import { copyLink, formatDateString } from "@/lib/utils";
import useTriggerStore from "@/store/useTriggerStore";
import useUserStore from "@/store/useUserStore";
import { Thread } from "@/types/threadType";
import {
  ChatBubbleIcon,
  HeartFilledIcon,
  HeartIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import {
  BellMinusIcon,
  BellOffIcon,
  FlagTriangleRightIcon,
  GripIcon,
  LinkIcon,
  ListXIcon,
  MessageCircleIcon,
  Repeat2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useMemo, useState } from "react";
import { useMutation } from "react-query";
import Carousel from "../custom/carousel";
import Carousel2 from "../custom/carousel2";
import { Button } from "../ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";
import { CreateReportCard } from "./CreateReportCard";
type Props = {
  data: Thread;
  displayType?: 1 | 2;
  className?: string;
  threadUrl: string;
};
export function ThreadCard({
  data,
  displayType = 1,
  className,
  threadUrl,
}: Readonly<Props>) {
  localStorage.clear(); // Xoá tất cả dữ liệu local
  caches.keys().then((names) => names.forEach((name) => caches.delete(name))); // Clear toàn bộ cache

  const [isLiked, setIsLiked] = useState(data.isLiked);
  const [isCreateReportCardOpen, setIsCreateReportCardOpen] = useState(false);
  const handleOpenCreateReportChange = () => {
    setIsCreateReportCardOpen(!isCreateReportCardOpen);
  };
  const [likeCount, setlikeCount] = useState<number>(data.likes?.length || 0);
  const user = useUserStore((state) => state.user);
  const { mutate: likeorunlikeThread } = useMutation({
    mutationFn: likeOrUnlikeThread,
    onSuccess: (data: { message: string }) => {
      console.log("Like/Unlike success:", data);
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
    },
  });
  const router = useRouter();

  const { mutate: createConversationFunc } = useMutation({
    mutationFn: createConversation,
    onSuccess: (data) => {
      router.push(`/chat?id=${data.conversation._id}`);
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
    },
  });
  const toggleLike = (id: string) => {
    isLiked
      ? setlikeCount((prevLikeCount) => prevLikeCount - 1)
      : setlikeCount((prevLikeCount) => prevLikeCount + 1);
    setIsLiked((prevIsLiked) => !prevIsLiked);
    likeorunlikeThread({ id });
  };
  const followContext = useContext(FollowContext);
  const handleFollow = followContext?.handleFollow;
  const followStatus = followContext?.followStatus || {};
  const isFollowed = useMemo(
    () => followStatus[data.postedBy?._id?.toString()] ?? data.isFollowed,
    [followStatus, data.postedBy._id]
  );
  const { toggleTrigger } = useTriggerStore();

  const quoteThread = `<blockquote class="text-post-media" data-text-post-permalink="${threadUrl}" id="ig-tp-DCYbxucSdAf" style="background:#FFF; border-width: 1px; border-style: solid; border-color: #00000026; border-radius: 16px; max-width:540px; margin: 1px; min-width:270px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
      <a href="${threadUrl}" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" target="_blank">
        <div style="padding: 40px; display: flex; flex-direction: column; align-items: center;">
          <div style="display:block; height:32px; width:32px; padding-bottom:20px;">
            <svg aria-label="Threads" height="32px" role="img" viewBox="0 0 192 192" width="32px" xmlns="http://www.w3.org/2000/svg">
              <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
            </svg>
          </div>
          <div style="font-size: 15px; line-height: 21px; color: #000000; font-weight: 600;"> View on Threads</div>
        </div>
      </a>
    </blockquote>
    <script async src="https://www.threads.net/embed.js"></script>
    `;
  return (
    <article
      className={`flex w-full flex-col rounded-xl bg-light-1 p-7 shadow-lg brightness-105 dark:bg-dark-2 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${data.postedBy._id}`}
              className="flex w-fit items-center"
            >
              <div className="relative size-11 cursor-pointer overflow-hidden">
                <Image
                  unoptimized
                  src={
                    data.postedBy.profilePic === ""
                      ? "/img/avatar.png"
                      : data.postedBy.profilePic
                  }
                  alt="avatar_image"
                  fill
                  className="cursor-pointer rounded-full"
                />
              </div>
              <div className="relative mt-2 w-0.5 grow rounded-full bg-slate-300 dark:bg-neutral-800" />
            </Link>
          </div>

          <div className="flex w-full flex-col">
            <div className="flex w-full flex-row items-center justify-between">
              <Link
                href={`/profile/${data.postedBy._id}`}
                className="flex w-fit items-center"
              >
                <h4 className="cursor-pointer text-2xl font-semibold dark:text-light-1">
                  {data?.postedBy?.name}
                </h4>
                {user && (
                  <div className="flex items-center">
                    <span
                      style={{
                        marginLeft: "10px",
                        display:
                          user?._id === data.postedBy._id?.toString()
                            ? "none"
                            : "inline-block",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleFollow &&
                          handleFollow(
                            data.postedBy._id.toString(),
                            followStatus[data.postedBy._id] || data.isFollowed
                          );
                      }}
                    >
                      <Button tabIndex={-1}>
                        {isFollowed ? "Unfollow" : "Follow"}
                      </Button>
                    </span>

                    <span
                      style={{
                        marginLeft: "10px",
                        display:
                          user?._id === data.postedBy._id?.toString()
                            ? "none"
                            : "inline-block",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        createConversationFunc(data.postedBy._id);
                      }}
                    >
                      <Button tabIndex={-1}>
                        <ChatBubbleIcon />
                      </Button>
                    </span>
                  </div>
                )}
              </Link>

              <span className="ml-3 text-xs text-dark-4">
                {formatDateString(data?.createdAt)}
              </span>
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger className="flex items-center rounded-full p-2 transition-all duration-150 hover:bg-[#e1e1e1] active:scale-95 data-[state=open]:bg-[#e1e1e1]">
                    <GripIcon className="size-6 cursor-pointer " />
                  </MenubarTrigger>
                  <MenubarContent align="end">
                    <MenubarItem className="flex cursor-default items-center justify-between py-2">
                      Chia sẻ<MenubarShortcut></MenubarShortcut>
                    </MenubarItem>

                    {user?._id !== data.postedBy._id?.toString() && (
                      <MenubarItem
                      onClick={() => {
                        setIsCreateReportCardOpen(!isCreateReportCardOpen);
                      }}
                      className="flex cursor-default items-center justify-between py-2"
                      >
                      Báo cáo
                      <FlagTriangleRightIcon className="size-4 cursor-pointer" />
                      </MenubarItem>
                    )}
                    <MenubarSeparator />
                    <MenubarItem
                      onClick={() => copyLink(threadUrl)}
                      className="flex cursor-default items-center justify-between py-2"
                    >
                      Copy link
                      <LinkIcon className="size-4 cursor-pointer" />
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
            <Link href={`/thread/${data._id}`}>
              <p className="mt-2 pb-3 text-sm dark:text-light-2 ">
                {data?.text}
              </p>
            </Link>
            {data?.imgs?.length > 0 &&
              (displayType === 1 ? (
                <Carousel images={data.imgs} />
              ) : (
                <Carousel2 images={data.imgs} />
              ))}
            <div className={`mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                {user && (
                  <button
                    onClick={() => toggleLike(data._id)}
                    className="flex items-center rounded-full px-2 py-1 transition-all duration-150 hover:bg-[#e1e1e1] active:scale-95"
                  >
                    {isLiked ? (
                      <HeartFilledIcon className="mr-px mt-px size-6 cursor-pointer object-contain text-red-600" />
                    ) : (
                      <HeartIcon className="mr-px mt-px size-6 cursor-pointer object-contain text-light-4" />
                    )}

                    <span className="ml-1 text-sm text-light-4">
                      {likeCount}
                    </span>
                  </button>
                )}
                {user && (
                  <button className="flex items-center rounded-full px-2 py-1 hover:bg-[#e1e1e1]">
                    <MessageCircleIcon
                      onClick={() => {
                        toggleTrigger("isCreateThreadCardOpened");
                      }}
                      className="mr-px mt-px size-6 cursor-pointer object-contain text-light-4"
                    />
                    <span className="ml-1 text-sm text-light-4">
                      {data?.children?.length}
                    </span>
                  </button>
                )}
                {user && (
                  <button className="flex items-center rounded-full px-2 py-1 hover:bg-[#e1e1e1]">
                    <Repeat2 className="mr-px mt-px size-6 cursor-pointer object-contain text-light-4" />
                    <span className="ml-1 text-sm text-light-4">
                      {data?.repostCount}
                    </span>
                  </button>
                )}

                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger className="flex items-center rounded-full p-2 transition-all duration-150 hover:bg-[#e1e1e1] active:scale-95 data-[state=open]:bg-[#e1e1e1]">
                      <Share1Icon className="mr-px mt-px size-6 cursor-pointer object-contain text-light-4" />
                    </MenubarTrigger>
                    <MenubarContent align="end">
                      <MenubarItem
                        onClick={() => copyLink(threadUrl)}
                        className="cursor-default py-2"
                      >
                        Copy Link
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem
                        onClick={() => copyLink(quoteThread)}
                        className="cursor-default py-2"
                      >
                       Chia sẻ
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateReportCard
        handleOpenCreateReportChange={handleOpenCreateReportChange}
        isOpen={isCreateReportCardOpen}
        reportedData={data}
      />
    </article>
  );
}

export default ThreadCard;
