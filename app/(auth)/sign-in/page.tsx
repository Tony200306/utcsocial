"use client";
import { Slack as Logo } from "lucide-react";
import { UserAuthForm } from "../_components/sign-in-form";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";

export default function SignIn() {
  const user = useUserStore((state) => state.user);
  if (user) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
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
          UTC Threads
        </div>
        <Logo className="relative m-auto" size={400} />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Education is the most powerful weapon which you can use to
              change the world.&rdquo;
            </p>
            <footer className="text-sm">Nelson Mandela</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-4xl font-semibold tracking-tight">Login</h1>
            <p className="pt-2 text-sm text-muted-foreground">
              You don&apos;t have an account yet?{" "}
              <Link
                className="underline underline-offset-4 hover:text-primary"
                href={"./sign-up"}
              >
                Sign up here
              </Link>
              .
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking login, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
