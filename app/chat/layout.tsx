"use client";
import { CreateThreadCard } from "@/components/cards/CreateThreadCard";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Topbar from "@/components/shared/Topbar";
import { Toaster } from "@/components/ui/toaster";
import useUserStore from "@/store/useUserStore";
import React, { useEffect } from "react";
import { FollowProvider } from "../../Context/Context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hydrateUser = useUserStore((state) => state.hydrateUser);
  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);
  return (
    <FollowProvider>
      <Topbar isMessagePage={true} />

      <main className="flex flex-row">
        <LeftSidebar />
        <section className="no-scrollbar flex min-h-screen flex-1 flex-col items-center bg-light-2 pt-20 dark:bg-dark-1">
          <div className="w-full max-w-9xl">{children}</div>
        </section>
        <RightSidebar />
        <CreateThreadCard />
        <Toaster />
      </main>
      <Bottombar />
    </FollowProvider>
  );
}
