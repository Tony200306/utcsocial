"use client";

import Bottombar from "@/components/shared/Bottombar";
import { Layout } from "@/components/custom/layout";
import { Input } from "@/components/ui/input";
import ThemeSwitch from "@/components/theme-switch";
import { UserNav } from "@/components/user-nav";
import { Separator } from "@/components/ui/separator";
import SidebarNav from "./components/sidebar-nav";
import LeftSidebar from "@/components/shared/LeftSidebar";
import {
  IconBrowserCheck,
  IconExclamationCircle,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from "@tabler/icons-react";
import useUserStore from "@/store/useUserStore";
import Topbar from "@/components/shared/Topbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <main className="flex flex-row">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col items-center bg-light-2 px-6 pb-10 pt-3 dark:bg-dark-1 max-md:pb-32 sm:px-10">
          <div className="w-full">
            <Layout fixed>
              {/* ===== Top Heading ===== */}
              <Layout.Header>
                <div className="ml-auto flex items-center space-x-4"></div>
              </Layout.Header>

              <Layout.Body className="flex flex-col">
                <div className="space-y-0.5">
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Cài đặt
                  </h1>
                  <p className="text-muted-foreground"></p>
                </div>
                <Separator className="my-4 lg:my-6" />
                <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
                  <aside className="top-0 lg:sticky lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                  </aside>
                  <div className="flex w-full p-1 pr-4 md:overflow-y-hidden">
                    {children}
                  </div>
                </div>
              </Layout.Body>
            </Layout>
          </div>
        </section>
      </main>
      <Bottombar />
    </>
  );
}

const sidebarNavItems = [
  {
    title: "Thông tin cá nhân",
    icon: <IconUser size={18} />,
    href: "/settings/profile",
  },
  {
    title: "Thay đổi mật khẩu",
    icon: <IconTool size={18} />,
    href: "/settings/account",
  },
];
