"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { Input } from "../ui/input";

interface Props {
  routeType: string;
}

function Searchbar({ routeType }: Readonly<Props>) {
  const router = useRouter();
  const searchParams = useSearchParams(); // Lấy các tham số trong URL
  const [search, setSearch] = useState(searchParams.get("q") || ""); // Lấy giá trị 'q' từ URL
  const inputRef = useRef<HTMLInputElement>(null); // Tạo ref cho input

  // Mỗi khi search thay đổi, cập nhật query params mà không reload trang
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=${search}`, { shallow: true });
      } else {
        router.push(`/${routeType}`, { shallow: true });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType, router]);

  // Đảm bảo input có focus sau khi load xong
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [search]); // Khi search thay đổi, focus vào input

  return (
    <div className="flex gap-1 rounded-lg border bg-light-2 px-4 py-2 shadow-md dark:bg-dark-3">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="text"
        ref={inputRef} // Gắn ref vào input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== "/search" ? "Search communities" : "Search creators"
        }`}
        className="no-focus border-none bg-light-2 text-base-regular outline-none dark:bg-dark-3 dark:text-light-4"
      />
    </div>
  );
}

export default Searchbar;
