"use client";
import { createThread, relyThread } from "@/apis/threads";
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
      <DialogContent className="custom-scrollbar max-h-[80%] max-w-[90%] overflow-y-scroll md:h-4/5 lg:w-1/2">
        <DialogHeader>
          <DialogTitle className="mb-2 text-center text-2xl font-medium">
            {currentThread ? "Reply" : "New thread"}
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col">
              {currentThread && (
                <div className="flex w-fit items-center">
                  <Avatar className="mr-4 size-12">
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
                  <h4 className="cursor-pointer text-2xl font-semibold dark:text-light-1">
                    {currentThread?.postedBy?.name}
                  </h4>
                  <span className="ml-3 text-xs text-dark-4">
                    {currentThread?.createdAt &&
                      formatDateString(currentThread.createdAt)}
                  </span>
                </div>
              )}
              <div className="mb-4 flex flex-col justify-center">
                {currentThread && (
                  <>
                    <p className="mt-2 pb-3 text-sm dark:text-light-2">
                      {currentThread?.text}
                    </p>
                    {currentThread?.imgs?.length > 0 && (
                      <Carousel2 images={currentThread.imgs} />
                    )}
                  </>
                )}
                <Separator className="my-3 w-full" />
                {!currentThread && (
                <div className="flex items-center">
                  <Avatar className="mr-4 size-12">
                    <AvatarImage src={user?.profilePic} alt="avatar" />
                    <AvatarFallback>
                      <AvatarImage
                        src="https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png"
                        alt="avatar"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900">{user?.name}</p>
                    <p className="text-gray-700">What&apos;s new?</p>
                  </div>
                </div>
              )}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="">
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
  text: z.string().min(1, "Text is required"),
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
        if(isDialog){
          console.log(isDialog)
          toggleTrigger("isCreateThreadCardOpened");
        }
        else{
          router.push(`/`);
        }
        toast({
          title: "Create Success",
        });
      },
      onError: (error: any) => {
        console.error("Error creating thread:", error);
        const errMessage =
          error?.response?.data?.error ||
          "Server error, please try again later";
        setErrorMessage(errMessage);
      },
    });

  const { isLoading: isLoadingRelyThread, mutate: mutateRelyThread } =
    useMutation(createThread, {
      onSuccess: () => {
        toggleTrigger("isCreateThreadCardOpened");
        toast({
          title: "Create Success",
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
          error?.response?.data?.error ||
          "Server error, please try again later";
        setErrorMessage(errMessage);
      },
    });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  // Sử dụng useCallback để tránh việc tái tạo lại hàm
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
        className={`flex flex-col justify-start gap-10 ${className}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mt-4 flex items-center">
          <ImageIcon
            className="mr-2 size-6 cursor-pointer text-gray-500"
            onClick={() => document.getElementById("fileInput")?.click()}
          />
          <FileIcon
            className="mr-2 size-6 cursor-pointer text-gray-500"
            onClick={() => document.getElementById("fileInput")?.click()}
          />
          <HashIcon className="mr-2 size-6 text-gray-500" />
          <MapPin className="mr-2 size-6 text-gray-500" />
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
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Uploaded Files:</h3>
            <div className="flex space-x-4">
              {uploadedFiles.map((file, index) => (
                <div key={file.name + index} className="relative">
                  <div
                    className="absolute right-0  top-0 z-10 cursor-pointer"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <XIcon className="m-1 size-5 cursor-pointer rounded-full text-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-200 hover:text-red-500" />
                  </div>
                  {file.type.startsWith("image") ? (
                    <Image
                      height={128}
                      width={128}
                      src={URL.createObjectURL(file)}
                      alt={`uploaded image ${index}`}
                      className="rounded object-cover"
                    />
                  ) : (
                    <video controls className="size-32 rounded object-cover">
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

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="font-semibold">Thread Text</FormLabel>
              <FormControl>
                <Textarea rows={10} className="no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Handling */}
        {errorMessage && (
          <p className="text-sm font-medium text-red-500 dark:text-red-900">
            {errorMessage}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Anyone can reply & quote</span>
          <Button
            className="rounded px-4 py-2 font-bold text-white"
            loading={isLoading}
          >
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default CreateThreadForm;