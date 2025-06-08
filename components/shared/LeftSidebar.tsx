"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import useUserStore from "@/store/useUserStore";
import { Button } from "../custom/button";
import { IconChevronsLeft } from "@tabler/icons-react";
import { LogOut } from "lucide-react";
import useTriggerStore from "@/store/useTriggerStore";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { LeftSidebarOpened, toggleTrigger } = useTriggerStore();
  const userId = useUserStore((state) => state?.user?._id);
  return (
    <section
      className={`custom-scrollbar sticky left-0 top-0 z-20 flex h-screen ${
        LeftSidebarOpened
          ? "w-64"
          : "w-[105px] transition-all duration-500 ease-in-out"
      } flex-col justify-between border-r border-r-light-6 pb-5 pt-28 dark:border-r-dark-4 dark:bg-dark-2 max-md:hidden`}
    >
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          const isCreateThreadLink = link.route === "/create-thread";

          if (link.route === "/profile" && userId)
            link.route = `${link.route}/${userId}`;

          return (
            <Link
              href={isCreateThreadLink ? "#" : link.route}
              key={link.label}
              className={`relative flex justify-start gap-4 rounded-lg p-4 ${
                isActive && "bg-light-5 dark:bg-primary-500"
              }`}
              onClick={
                isCreateThreadLink
                  ? () => toggleTrigger("isCreateThreadCardOpened")
                  : undefined
              }
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              {LeftSidebarOpened && (
                <p className={`dark:text-light-1 max-lg:hidden`}>
                  {link.label}
                </p>
              )}
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <div className="flex cursor-pointer gap-4 p-4">
          <LogOut className="size-6" />
          {LeftSidebarOpened && (
            <p className="dark:text-light-2 max-lg:hidden">Logout</p>
          )}
        </div>
      </div>
      {/* Scrollbar width toggle button */}
      <Button
        onClick={() => toggleTrigger("LeftSidebarOpened")}
        size="icon"
        variant="outline"
        className="absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
      >
        <IconChevronsLeft
          stroke={1.5}
          className={`size-5 ${LeftSidebarOpened ? "rotate-180" : ""}`}
        />
      </Button>
    </section>
  );
};

export default LeftSidebar;
