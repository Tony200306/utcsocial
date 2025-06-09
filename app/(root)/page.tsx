"use client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";
import { getThreads } from "@/apis/threads";
import { useQuery } from "react-query";
import useUserStore from "@/store/useUserStore";
import { useEffect, useState, useRef } from "react";
import ThreadCardSekeleton from "@/components/cards/ThreadCardSekeleton";
import { throttle } from "@/lib/utils";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
const socket = io("http://localhost:5000");
export default function Home({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | undefined };
}>) {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 4;
  const [threads, setThreads] = useState<any[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const user = useUserStore((state) => state.user);

  socket.on("connect", () => {
    const userId = user?._id;
    socket.emit("register", userId);
  });

  useEffect(() => {
    // Đăng ký sự kiện một lần khi component mount
    socket.on("notification", (notification) => {
      if (notification.action === "like") {
        toast("Thông báo hoạt động", {
          description: `${notification.username} đã bày tỏ cảm xúc về một bài viết`,
          action: {
            label: "Ẩn",
            onClick: () => console.log(""),
          },
        });
      }
    });

    // Cleanup: Hủy đăng ký khi component unmount
    return () => {
      socket.off("notification");
    };
  }, []); // Dependency rỗng đảm bảo chạy chỉ 1 lần

  // Sử dụng useEffect để đăng ký socket sau khi có user:
  // Có thể sử dụng useEffect để lắng nghe sự thay đổi của user và chỉ emit sự kiện khi user đã
  useEffect(() => {
    if (user && user._id) {
      // Đảm bảo rằng socket đã kết nối
      if (socket.connected) {
        socket.emit("register", user._id);
      } else {
        socket.on("connect", () => {
          socket.emit("register", user._id);
        });
      }
    }
  }, [user]);

  // Redirect to onboarding if user has not completed it
  useEffect(() => {
    if (user?.onboarded === false) {
      router.push("/onboarding");
    }
  }, [user, router]);

  // Fetch threads data using React Query
  const { isLoading, isFetching } = useQuery(
    ["threads", pageNumber],
    () => getThreads({ pageNumber, pageSize }),
    {
      keepPreviousData: true,
      onSuccess: (newData) => {
        console.log(newData, "newData");
        console.log("prevThreads", threads);
        setThreads((prevThreads) => {
          const prevIds = new Set(prevThreads.map((t) => t._id));
          const uniqueNewThreads = newData.threads.filter(
            (t) => !prevIds.has(t._id)
          );
          return [...prevThreads, ...uniqueNewThreads];
        });
      },
      onError: (err) => {
        console.error("Error fetching threads:", err);
      },
    }
  );
  // Infinite scroll handler with throttle
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (loaderRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = loaderRef.current;
        console.log(
          scrollTop,
          scrollHeight,
          clientHeight,
          "scrollTop, scrollHeight, clientHeight"
        );
        if (scrollHeight - scrollTop - clientHeight <= 0 && !isFetching) {
          setPageNumber((prev) => prev + 1);
        }
      }
    }, 300); // Adjust delay as needed

    const divRef = loaderRef.current;
    divRef?.addEventListener("scroll", handleScroll);

    return () => {
      divRef?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);
  
  return (
    <>
      <h1 className="head-text text-left text-2xl font-bold text-dark-1 dark:text-light-1">
       Bài viết mới nhất
      </h1>

      <section
        ref={loaderRef}
        className="no-scrollbar mt-9 flex max-h-[80vh] flex-col gap-10 overflow-auto"
      >
        {isLoading && threads.length === 0
          ? Array(5)
              .fill(0)
              .map(() => <ThreadCardSekeleton key={uuidv4()} />)
          : threads.map((thread) => (
              <ThreadCard
                threadUrl={thread._id}
                displayType={2}
                key={thread._id}
                data={thread}
              />
            ))}
        {!isLoading && threads.length === 0 && (
          <p className="no-result">No threads found</p>
        )}

        {isFetching && <ThreadCardSekeleton key={uuidv4()} />}
        <div />
      </section>
      <Toaster />
    </>
  );
}
