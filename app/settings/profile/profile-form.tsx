"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/custom/button";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { updateUser } from "@/apis/user";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  name: z
    .string({ required_error: "Please enter your name." })
    .min(2, { message: "Name must be at least 2 characters." })
    .max(10, { message: "Name must not be longer than 10 characters." }),
  bio: z
    .string()
    .min(4, { message: "Bio must be at least 4 characters." })
    .max(160, { message: "Bio must not be longer than 160 characters." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user, hydrateUser } = useUserStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const defaultValues: Partial<ProfileFormValues> = {
    bio: user?.bio ?? "",
    username: user?.username ?? "",
    name: user?.name ?? "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onSubmit",
  });
  const { mutate: mutateUpdateUser } = useMutation(updateUser, {
    onSuccess: () => {
         toast("Thông báo hoạt động", {
          description: `Đã cập nhật thông tin thành công`,
          action: {
            label: "Ẩn",
            onClick: () => console.log(""),
          },
        });
    },
    onError: (error: any) => {
      console.error("Error creating thread:", error);
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    if (!file) {
      setImageError("Please upload a profile photo.");
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setImageError("Please upload a valid image (PNG or JPEG).");
      return;
    }
    mutateUpdateUser({
      userId: user?._id ?? "",
      name: data.name,
      username: data.username,
      bio: data.bio,
      profilePic: null,
      imgs: file ? [file] : null,
    });

    // Nếu không lỗi ảnh, reset error
    setImageError(null);

    console.log("Form submitted", data);
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile && selectedFile.type.includes("image")) {
      setFile(selectedFile);
      setImageError(null);
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImageError("Please select a valid image file.");
    }
  };

  useEffect(() => {
    if (!user) {
      hydrateUser();
    } else {
      form.reset({
        bio: user.bio ?? "",
        username: user.username ?? "",
        name: user.name ?? "",
      });
    }
  }, [user, hydrateUser, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Image upload không dùng FormField */}
        <div className="flex items-center gap-4">
          <label>
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="profile_icon"
                width={96}
                height={96}
                className="rounded-full"
              />
            ) : (
              <Image
              unoptimized
                src={user?.profilePic ?? "/images/profile.png"}
                alt="profile_icon"
                width={100}
                height={100}
                className="rounded-full object-contain"
              />
            )}
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="flex-1"
          />
        </div>
        {imageError && (
          <p className="text-sm text-red-500 font-medium">{imageError}</p>
        )}

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users to link them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update profile</Button>
      </form>
              <Toaster/>
      
    </Form>
    
  );
}
