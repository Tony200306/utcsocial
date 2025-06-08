"use client";
import { getThreadsByUser } from "@/apis/threads";
import { getUserById } from "@/apis/user";
import ThreadsTab from "@/components/cards/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { throttle } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  // { value: "repost", label: "Repost", icon: "/assets/tag.svg" },
];

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [pageNumber, setPageNumber] = useState({
    threads: 1,
    replies: 1,
  });
  const [activeTab, setActiveTab] = useState<"threads" | "replies">("threads");

  const router = useRouter();
  const pageSize = 5;
  const currentUser = useUserStore((state) => state.user);
  const profileId = params.id;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useQuery({
    queryKey: ["user", profileId],
    queryFn: () => getUserById({ id: profileId }),
    onError: (error) => {
      console.error("Error fetching  data:", error);
    },
    enabled: !!profileId,
  });
  const { data: threadsData } = useQuery({
    queryKey: ["threadsById", profileId, pageNumber],
    queryFn: () => getThreadsByUser({ id: profileId, pageNumber: pageNumber[activeTab], pageSize }),
    onError: (error) => {
      console.error("Error fetching  data:", error);
    },
    enabled: !!profileId,
  });
  const handleScroll = throttle(() => {
    if (loaderRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = loaderRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 100 && !isLoadingMore) {
        setIsLoadingMore(true);
        setPageNumber((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab] + 1,
        }));
      }
    }
  }, 200);
  useEffect(() => {
    const divRef = loaderRef.current;
    divRef?.addEventListener("scroll", handleScroll);

    return () => {
      divRef?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
  useEffect(() => {
    if (threadsData?.threads) {
      // setThreads((prevThreads) => [...prevThreads, ...threadsData.threads]);
      setIsLoadingMore(false);
    }
  }, [threadsData]);

  if (currentUser?.onboarded === false) {
    router.push("/onboarding");
  }

  const [dataMap, setDataMap] = useState<{ [key: string]: any[] }>({
    threads: [],
    replies: [],
  });

  if (!userData) return <>ko tìm thấy user</>;
  return (
    <section>
      <ProfileHeader data={userData} />
      <div
        ref={loaderRef}
        className="no-scrollbar mt-9 max-h-[80vh] overflow-auto"
      >
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="flex min-h-[50px] flex-1 items-center justify-evenly gap-3 bg-light-1 text-primary shadow-md data-[state=active]:shadow-none dark:bg-dark-4 dark:text-light-2 dark:data-[state=active]:bg-[#0e0e12]">
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                onClick={() => {
                  setActiveTab(tab.value as "threads" | "replies");
                }}
                className="ml-1 rounded-none hover:bg-none focus:bg-none data-[state=active]:border-b-2 data-[state=active]:border-b-black dark:text-light-2 "
              >
                <Image
                  unoptimized
                  src={tab.icon}
                  alt={tab.label}
                  width={23}
                  height={23}
                  className="object-contain"
                />
                <p className="text-base text-primary max-sm:hidden ">
                  {tab.label}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full dark:text-light-1"
            >
              <ThreadsTab
                pageNumber={pageNumber[tab.value as "threads" | "replies"]}
                key={tab.label}
                currentUserId={userData?._id ?? ""}
                accountId={userData?._id ?? ""}
                accountType="User"
                type={tab.value as "threads" | "replies"}
                dataMap={dataMap}
                setDataMap={setDataMap}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
