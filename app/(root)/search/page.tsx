"use client";
/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import { getThreadsBySearch } from "@/apis/search"; // Điều chỉnh import cho đúng đường dẫn API
import { Input } from "@/components/ui/input";
import ThreadCard from "@/components/cards/ThreadCard";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Page() {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const {
    data: threadsData,
    isFetching,
    error,
    refetch,
  } = useQuery(
    ["threadsSearch", search],
    () => getThreadsBySearch({ query: search }),
    {
      enabled: false, // Chưa fetch khi trạng thái mặc định
      refetchOnWindowFocus: false,
    }
  );

  const user = useUserStore((state) => state.user);
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/error";
    }
    return null;
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim() !== "") {
      setShowResults(true);
      refetch();
    }
  };

  return (
    <section className="rounded-xl bg-light-1 p-10 shadow-md">
      <h1 className="head-text mb-10">Tìm kiếm</h1>
      <div className="relative w-full">
        <div className="relative flex gap-1 rounded-lg border bg-light-2 px-4 py-2 shadow-md dark:bg-dark-3">
          <Input
            id="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search user or thread"
            className="no-focus border-none bg-light-2 outline-none dark:bg-dark-3 dark:text-light-4"
          />
        </div>
      </div>

      {isFetching && (
        <div className="mt-4 w-full">
          <p>Đang tải...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 w-full">
          <p className="text-red-500">Có lỗi khi tìm kiếm</p>
        </div>
      )}

      {showResults && threadsData && threadsData.threads && (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {threadsData.threads.map((thread) => (
            <ThreadCard
              key={thread._id}
              data={thread}
              threadUrl={`/thread/${thread._id}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
