"use client";

import { toggleThreadVisibility } from "@/apis/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Thread } from "@/types/threadType";

interface ThreadStatusModalProps {
  thread: Thread | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  action: "hide" | "show"; // Ẩn hoặc hiện thread
}

export function ThreadStatusModal({
  thread,
  isOpen,
  onClose,
  onSuccess,
  action,
}: ThreadStatusModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!thread) return null;

  const isHideAction = action === "hide";
  const newStatus = isHideAction ? true : false; // isHidden
  const actionText = isHideAction ? "Ẩn" : "Hiện";
  const actionDescription = isHideAction
    ? "ẩn thread này. Thread sẽ không hiển thị công khai cho người dùng."
    : "hiện thread này. Thread sẽ được hiển thị công khai cho người dùng.";

  const handleUpdateStatus = async () => {
    if (!thread) return;

    setIsUpdating(true);
    try {
      console.log("=== UPDATE THREAD STATUS ===");
      console.log("Thread ID:", thread._id);
      console.log("Current Status:", thread.isHidden);
      console.log("Action:", action);
      console.log("New Status:", newStatus);

      const result = await toggleThreadVisibility({
        id: thread._id,
      });

      console.log("Update result:", result);

      if (result.success) {
        toast.success(result.message || `${actionText} thread thành công`);
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Update thread status error:", error);
      toast.error(
        error.message || `Có lỗi xảy ra khi ${actionText.toLowerCase()} thread`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-300 sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isHideAction ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <EyeOff className="h-5 w-5 text-red-600" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            )}
            <div>
              <DialogTitle className="text-gray-900">
                {actionText} thread
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Xác nhận thay đổi trạng thái hiển thị thread
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thread Info */}
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="space-y-2">
              <div>
                <p className="font-medium text-gray-900 text-sm">Thread ID:</p>
                <p className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                  {thread._id}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Nội dung:</p>
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {thread.text?.substring(0, 100) || "Không có nội dung"}
                  {thread.text && thread.text.length > 100 && "..."}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Tác giả:</p>
                <p className="text-sm text-gray-700">
                  @{thread.postedBy?.username}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Trạng thái hiện tại:
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                      thread.isHidden
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {thread.isHidden ? "Đã ẩn" : "Đang hiện"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {thread.likeCount || 0} likes • {thread.commentCount || 0}{" "}
                    comments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div
            className={`flex items-start gap-3 rounded-lg p-4 border ${
              isHideAction
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 mt-0.5 ${
                isHideAction ? "text-red-600" : "text-green-600"
              }`}
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  isHideAction ? "text-red-800" : "text-green-800"
                }`}
              >
                Xác nhận {actionText.toLowerCase()} thread
              </p>
              <p
                className={`text-sm mt-1 ${
                  isHideAction ? "text-red-700" : "text-green-700"
                }`}
              >
                Bạn có chắc chắn muốn {actionDescription}
              </p>
            </div>
          </div>

          {/* Status Change Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Thay đổi trạng thái:
            </p>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Từ:</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    thread.isHidden
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {thread.isHidden ? "Đã ẩn" : "Đang hiện"}
                </span>
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Thành:</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    newStatus
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {newStatus ? "Đã ẩn" : "Đang hiện"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Hủy
          </Button>
          <Button
            onClick={handleUpdateStatus}
            disabled={isUpdating}
            className={`${
              isHideAction
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isUpdating
              ? "Đang xử lý..."
              : `Xác nhận ${actionText.toLowerCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
