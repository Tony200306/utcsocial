"use client";
/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import { fetchSearchSuggestions } from "@/apis/search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Page() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data: userSearch = [], isFetching } = useQuery(
    ["searchSuggestions", search],
    () => fetchSearchSuggestions(search),
    {
      enabled: !!search, // Chỉ fetch khi search không rỗng
      staleTime: 1 * 60 * 1000, // Caching 5 phút
      refetchOnWindowFocus: false, // Không refetch khi focus lại cửa sổ
    }
  );
  const user = useUserStore((state) => state.user);
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/error";
    }
    return null;
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      router.push(`/search/searchResult?query=${search}`);
    }
  };

  return (
    <section className="rounded-xl bg-light-1 p-10 shadow-md">
      <h1 className="head-text mb-10">Tìm kiếm</h1>
      <div className="relative w-full">
        <div className="relative flex gap-1 rounded-lg border bg-light-2 px-4 py-2 shadow-md dark:bg-dark-3">
          <Image
            src="/assets/search-gray.svg"
            alt="search"
            width={24}
            height={24}
            className="object-contain"
          />
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
      {/* Hiển thị danh sách gợi ý nếu có */}
      {isFetching ? (
        <div className="z-10 mt-4 w-full rounded-md bg-white bg-opacity-80 shadow-none">
          <p className="p-2 text-gray-500">Đang tải...</p>
        </div>
      ) : (
        userSearch.length > 0 && (
          <ul className="z-10 mt-4 w-full rounded-md bg-white bg-opacity-80 shadow-none">
            {userSearch.map((user: any) => (
              <Link href={`/profile/${user._id}`} key={user._id}>
                <li className="flex cursor-pointer items-center gap-2 border-b border-gray-300 p-2 hover:bg-gray-200">
                  <Avatar className="size-7">
                    <AvatarImage src={user.profilePic} alt="avatar" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-gray-500">@{user.username}</span>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )
      )}
    </section>
  );
}
