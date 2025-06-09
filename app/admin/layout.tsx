"use client";
import { Inbox, Book, GroupIcon, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardIcon } from "@radix-ui/react-icons";
import useUserStore from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const items = [
  {
    title: "Thống kê",
    url: "/admin",
    icon: DashboardIcon,
  },
  {
    title: "Báo cáo",
    url: "/admin/report",
    icon: Inbox,
  },
  {
    title: "Bài viết",
    url: "/admin/threads",
    icon: Book,
  },
  {
    title: "Người dùng",
    url: "/admin/users",
    icon: User2,
  },
  {
    title: "Người quản trị và kiểm duyệt",
    url: "/admin/permissionManagement",
    icon: GroupIcon,
  },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!user) return;
    if (user.role !== "super_admin" && user.role !== "moderator") {
      router.replace("/error");
    } else {
      setIsChecking(false);
    }
  }, [user, router]);

  if (!user || isChecking) {
    // Có thể render spinner, loading state
    return <div className="p-4">Loading...</div>;
  }
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg text-foreground">
              UTC Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main style={{ width: "80%", padding: "10px" }}>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
