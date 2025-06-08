"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import ThreadCardSekeleton from "@/components/cards/ThreadCardSekeleton";
import { getRepliesThread, getThreadById } from "@/apis/threads";
import ThreadCard from "@/components/cards/ThreadCard";
import { throttle } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const threadId = params.id;

  const pageSize = 5;
  const loaderRef = useRef<HTMLDivElement>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [comments, setComments] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Redirect if not onboarded
  useEffect(() => {
    if (currentUser?.onboarded === false) {
      router.push("/onboarding");
    }
  }, [currentUser, router]);

  // Fetch thread
  const { data: threadData, isLoading: isLoadingThread } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getThreadById({ id: threadId }),
    enabled: !!threadId,
  });

  // Fetch comments per page
  const { data: commentPage, isFetching } = useQuery({
    queryKey: ["comments", threadId, pageNumber],
    queryFn: () => getRepliesThread({ id: threadId, pageNumber, pageSize }),
    enabled: !!threadId && hasMore,
    keepPreviousData: true,
  });

  // Append new comments when commentPage updates
  useEffect(() => {
    if (commentPage?.threads) {
      if (pageNumber === 1) {
        setComments(commentPage.threads);
      } else {
        setComments((prev) => [...prev, ...commentPage.threads]);
      }

      setHasMore(commentPage.threads.length === pageSize);
      setIsLoadingMore(false);
    }
  }, [commentPage]);

  // Infinite scroll handler
  const handleScroll = throttle(() => {
    const el = loaderRef.current;
    if (!el || isLoadingMore || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    console.log(
      scrollTop,
      scrollHeight,
      clientHeight,
      "scrollHeight, scrollTop, clientHeight"
    );

    if (scrollHeight - scrollTop - clientHeight <= 100) {
      setIsLoadingMore(true);
      setPageNumber((prev) => prev + 1);
    }
  }, 200);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll, isLoadingMore, hasMore]);

  if (isLoadingThread) {
    return <p className="no-result">Loading thread...</p>;
  }

  if (!threadData) {
    return <p className="no-result">No thread found</p>;
  }

  return (
    <section
      ref={loaderRef}
      className="no-scrollbar relative mt-10 flex max-h-[80vh] flex-col gap-10 overflow-auto"
    >
      <ThreadCard
        key={threadData._id}
        data={threadData}
        threadUrl={`http://localhost:3000/thread/${threadData._id}`}
      />

      <div className="my-10">
        {isFetching && comments.length === 0 ? (
          Array(5)
            .fill(0)
            .map(() => <ThreadCardSekeleton key={uuidv4()} />)
        ) : comments.length === 0 ? (
          <p className="no-result">No comments found</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex justify-around items-between gap-2"
            >
              <div className="flex">
                <div className="border-r-4 h-[100px] w-4"></div>
                <div className="border-b-4 h-[100px] w-4"></div>
              </div>
              <ThreadCard
                className="!w-[90%] border-l-4 border-blue-200 rounded-md p-3 mt-2"
                threadUrl={`http://localhost:3000/thread/${threadData._id}`}
                data={comment}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
