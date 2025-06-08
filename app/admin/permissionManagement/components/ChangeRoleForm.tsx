"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateUserRoleStatus } from "@/apis/admin";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation } from "react-query";

const FormSchema = z.object({
  role: z.string({
    required_error: "Hãy chọn quyền",
  }),
});

export function ChangeRoleForm({
  id,
  roleDefault,
}: {
  id: string;
  roleDefault: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: string;
    }) => {
      return await updateUserRoleStatus({ id: userId, roleStatus: newRole });
    },
    onSuccess: () => {
      window.location.reload();
      toast("Thay đổi quyền", {
        description: "Đã cập nhật quyền thành công",
        action: {
          label: "Dismiss",
          onClick: () => {},
        },
      });
    },
    onError: () => {},
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateRoleMutation.mutate({
      userId: id,
      newRole: data.role,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quyền</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={roleDefault}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn một quyền" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type="submit">Thay đổi</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
