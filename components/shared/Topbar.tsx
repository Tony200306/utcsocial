"use client";
import { logout } from "@/apis/user";
import useTriggerStore from "@/store/useTriggerStore";
import useUserStore from "@/store/useUserStore";
import { Slack as Logo, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
function Topbar({ isMessagePage }: { isMessagePage?: boolean }) {
  const { LeftSidebarOpened } = useTriggerStore();
  const avatarUrl = useUserStore((state) => state.user?.profilePic);
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();
  const isProfilePage = pathname.includes("/profile");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await logout();
      console.log(res.message); // thông báo logout thành công

      // Redirect về trang login hoặc trang chủ
      router.push("/sign-in"); // hoặc "/"
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Đăng xuất thất bại!");
    }
  };
  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-light-1 px-8 py-5 shadow-xl dark:bg-dark-2 lg:bg-transparent lg:shadow-none">
      <Link href="/" className="flex items-center gap-1">
        <Logo className="relative m-auto size-10" />
        {LeftSidebarOpened && (
          <p className="text-3xl font-semibold dark:text-light-1 max-xs:hidden">
            UTC FORUM
          </p>
        )}
        {isMessagePage && (
          <h1 className="text-bold text-[31px] ml-[3vw]">TIN NHẮN</h1>
        )}
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <div className="flex cursor-pointer">
            <Image
              src="/assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
          </div>
        </div>
        {!isProfilePage && (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="flex items-center rounded-full p-2 transition-all duration-150 hover:border-[#e1e1e1] focus:outline-none focus:ring-2 focus:ring-white active:scale-95 data-[state=open]:border-[#e1e1e1]">
                <Avatar>
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              <MenubarContent align="end">
                {user && (
                  <MenubarItem
                    onClick={() => {
                      handleLogout();
                    }}
                    className="flex cursor-default items-center justify-between py-2"
                  >
                    Log out
                    <LogOut className="ml-2 size-4  cursor-pointer" />
                  </MenubarItem>
                )}{" "}
                {!user && (
                 <MenubarItem
                    onClick={() => {
                      router.push("/sign-in");
                    }}
                    className="flex cursor-default items-center justify-between py-2"
                  >
                    Đăng nhập
                  </MenubarItem>
                )}{" "}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>
    </nav>
  );
}

export default Topbar;
