"use client";
import { createThread } from "@/apis/threads";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  File as FileIcon,
  MapPin,
  HashIcon,
  ImageIcon,
  XIcon,
  Send,
} from "lucide-react";
import useTriggerStore from "@/store/useTriggerStore";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../custom/button";
import useUserStore from "@/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import useTempStore from "@/store/useTempStore";
import Carousel2 from "../custom/carousel2";
import { formatDateString } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";

export function CreateThreadCard() {
  const { currentThread } = useTempStore();
  const { user } = useUserStore();
  const { isCreateThreadCardOpened, toggleTrigger } = useTriggerStore();
  const handleOpenChange = () => {
    toggleTrigger("isCreateThreadCardOpened");
  };
  console.log(currentThread);
  return (
    <Dialog open={isCreateThreadCardOpened} onOpenChange={handleOpenChange}>
      <DialogContent className="custom-scrollbar max-h-[85%] max-w-2xl overflow-y-auto rounded-xl border-0 bg-white shadow-2xl dark:bg-gray-900">
        <DialogHeader className="space-y-4 pb-4">
          <DialogTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            {currentThread ? "Trả lời bài viết" : "Tạo bài viết mới"}
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              {currentThread && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="flex items-start space-x-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={currentThread?.postedBy.profilePic}
                        alt="avatar"
                      />
                      <AvatarFallback>
                        <AvatarImage
                          src="https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png"
                          alt="avatar"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {currentThread?.postedBy?.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {currentThread?.createdAt &&
                            formatDateString(currentThread.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {currentThread?.text}
                      </p>
                      {currentThread?.imgs?.length > 0 && (
                        <div className="mt-3">
                          <Carousel2 images={currentThread.imgs} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <Separator className="my-4" />
              {!currentThread && (
                <div className="flex items-center space-x-3 p-2">
                  <Avatar className="size-12">
                    <AvatarImage src={user?.profilePic} alt="avatar" />
                    <AvatarFallback>
                      <AvatarImage
                        src="https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png"
                        alt="avatar"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bạn đang nghĩ gì?
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <CreateThreadForm
            isRely={Boolean(currentThread?._id)}
            parentId={currentThread?._id}
            isDialog={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  text: z.string().min(1, "Nội dung không được để trống"),
});

type FormData = z.infer<typeof formSchema>;

function CreateThreadForm({
  className,
  isRely,
  parentId,
  isDialog,
}: {
  className?: string;
  isRely: boolean;
  parentId?: string;
  isDialog?: boolean;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toggleTrigger } = useTriggerStore();
  const { setCurrentThread } = useTempStore();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  // API mutation setup with React Query
  const { isLoading: isLoadingCreateNewThread, mutate: mutateCreateNewThread } =
    useMutation(createThread, {
      onSuccess: () => {
        if (isDialog) {
          console.log(isDialog);
          toggleTrigger("isCreateThreadCardOpened");
        } else {
          router.push(`/`);
        }
        toast({
          title: "Tạo bài viết thành công",
        });
      },
      onError: (error: any) => {
        console.error("Error creating thread:", error);
        const errMessage =
          error?.response?.data?.error || "Lỗi máy chủ, vui lòng thử lại sau";
        setErrorMessage(errMessage);
      },
    });

  const { isLoading: isLoadingRelyThread, mutate: mutateRelyThread } =
    useMutation(createThread, {
      onSuccess: () => {
        toggleTrigger("isCreateThreadCardOpened");
        toast({
          title: "Trả lời thành công",
        });
        queryClient.invalidateQueries(["comments", parentId]);
        queryClient.refetchQueries(["comments", parentId]);
        if (pathname !== "/thread") {
          router.push(`/thread/${parentId}`);
        }
      },
      onError: (error: any) => {
        console.error("Error creating thread:", error);
        const errMessage =
          error?.response?.data?.error || "Lỗi máy chủ, vui lòng thử lại sau";
        setErrorMessage(errMessage);
      },
    });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
      }
    },
    []
  );

  const handleRemoveFile = useCallback((index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const onSubmit = async (values: FormData) => {
    if (!isRely) {
      console.log("Create new thread", values, uploadedFiles);
      mutateCreateNewThread({
        text: values.text,
        media: uploadedFiles,
      });
    } else {
      mutateRelyThread({
        text: values.text,
        media: uploadedFiles,
        parentId: parentId ?? "",
      });
    }
  };

  const isLoading = isLoadingCreateNewThread || isLoadingRelyThread;

  useEffect(() => {
    return () => {
      if (parentId) setCurrentThread(null);
    };
  }, []);

  return (
    <Form {...form}>
      <form
        className={`space-y-6 ${className}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Media Upload Buttons */}
        <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <button
            type="button"
            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-900/20"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <ImageIcon className="size-4" />
            <span>Phương tiện</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-green-900/20"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <FileIcon className="size-4" />
            <span>Tệp</span>
          </button>
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Display uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Tệp đã tải lên:
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {uploadedFiles.map((file, index) => (
                <div key={file.name + index} className="group relative">
                  <button
                    type="button"
                    className="absolute -right-2 -top-2 z-10 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <XIcon className="size-4" />
                  </button>
                  {file.type.startsWith("image") ? (
                    <Image
                      height={120}
                      width={120}
                      src={URL.createObjectURL(file)}
                      alt={`uploaded image ${index}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <video
                      controls
                      className="h-24 w-full rounded-lg object-cover"
                    >
                      <source
                        src={URL.createObjectURL(file)}
                        type={file.type}
                      />
                    </video>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text Input */}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-900 dark:text-white">
                Nội dung bài viết
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  className="resize-none rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                  placeholder={
                    isRely
                      ? "Viết phản hồi của bạn..."
                      : "Chia sẻ suy nghĩ của bạn..."
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Mọi người có thể trả lời & trích dẫn
          </span>
          <Button
            className="!bg-black flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            loading={isLoading}
            disabled={isLoading}
          >
            <Send className="size-4" />
            <span className="">{isRely ? "Trả lời" : "Đăng bài"}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateThreadForm;
