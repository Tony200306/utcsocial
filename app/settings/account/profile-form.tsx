"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
// giả sử bạn có API đổi mật khẩu
import { changePassword } from "@/apis/user";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, "Mật khẩu hiện tại là bắt buộc."),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự."),
    confirmPassword: z.string().min(6, "Vui lòng xác nhận mật khẩu mới."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu không khớp.",
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ChangePasswordForm() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const { mutate: mutateChangePassword, isLoading } = useMutation(changePassword, {
    onSuccess: () => {
      toast("Cập nhật mật khẩu thành công", {
        description: "Bạn có thể sử dụng mật khẩu mới để đăng nhập.",
        action: {
          label: "Đóng",
          onClick: () => {},
        },
      });
      form.reset();
    },
    onError: (error: any) => {
      toast.error("Không thể cập nhật mật khẩu", {
        description: error?.message || "Vui lòng thử lại.",
      });
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    mutateChangePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập mật khẩu hiện tại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Xác nhận mật khẩu mới" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </Button>
      </form>
      <Toaster />
    </Form>
  );
}
