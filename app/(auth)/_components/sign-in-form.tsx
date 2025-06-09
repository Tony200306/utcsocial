"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandFacebook, IconBrandGithub } from "@tabler/icons-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { PasswordInput } from "@/components/custom/password-input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes, useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { useMutation } from "react-query";
import { signinUser } from "@/apis/auth";
import { useRouter } from "next/navigation";
import { User } from "@/types/userType";
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email của bạn" })
    .email({ message: "Địa chỉ email không hợp lệ" }),
  password: z
    .string()
    .min(1, {
      message: "Vui lòng nhập mật khẩu của bạn",
    })
    .min(6, {
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/, {
      message:
        "Mật khẩu phải bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.",
    }),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  if (user) router.push("./");
  if (user?.onboarded === false) router.push("./onboarding");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // api react query
  const { isLoading, mutate: mutateSignIn } = useMutation(signinUser, {
    onSuccess: (data: User) => {
      setUser(data);
      router.push("./onboarding");
    },
    onError: (error: any) => {
      console.error("Lỗi đăng nhập:", error);
      const errMessage =
        error?.response?.data?.error || "Lỗi máy chủ, vui lòng thử lại sau";
      setErrorMessage(errMessage);
    },
  });
  // end api react query
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "cuongvu220603@gmail.com",
      password: "Cuongvu220603@",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutateSignIn({ ...data });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ten@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Mật khẩu</FormLabel>
                    <Link
                      href={"/forgot-password"}
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error handling */}
            {errorMessage && (
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {errorMessage ?? "Đã xảy ra lỗi, vui lòng thử lại."}
              </p>
            )}

            <Button className="mt-2" loading={isLoading}>
              Đăng nhập
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
