"use client";
import { Slack as Logo } from "lucide-react";
import { UserAuthForm } from "../_components/sign-in-form";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";
import { useUserStoreHydration } from "@/hooks/useUserStoreHydration";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const user = useUserStore((state) => state.user);
  const hydrateUser = useUserStore((state) => state.hydrateUser);
  const isHydrated = useUserStoreHydration();
  const router = useRouter();

  // Hydrate user from cookies when component mounts
  useEffect(() => {
    if (isHydrated && !user) {
      hydrateUser();
    }
  }, [isHydrated, user, hydrateUser]);

  // Redirect if user is logged in
  useEffect(() => {
    if (isHydrated && user) {
      router.push("/");
    }
  }, [isHydrated, user, router]);

  // Show loading during hydration
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render if user is logged in
  if (user) {
    return null;
  }

  return (
    <div className="container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-2xl font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 size-7"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          UTC Forum
        </div>
        <Logo className="relative m-auto" size={400} />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Giáo dục là vũ khí mạnh nhất mà bạn có thể sử dụng để
              thay đổi thế giới.&rdquo;
            </p>
            <footer className="text-sm">Nelson Mandela</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-4xl font-semibold tracking-tight">Đăng nhập</h1>
            <p className="pt-2 text-sm text-muted-foreground">
              Bạn chưa có tài khoản?{" "}
              <Link
                className="underline underline-offset-4 hover:text-primary"
                href={"./sign-up"}
              >
                Đăng ký tại đây
              </Link>
              .
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}

