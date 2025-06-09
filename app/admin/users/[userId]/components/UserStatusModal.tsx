"use client";

import { updateUserStatus } from "@/apis/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "@/types/userType";

interface UserStatusModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  action: "block" | "unblock"; // Thêm prop để xác định action
}

export function UserStatusModal({
  user,
  isOpen,
  onClose,
  onSuccess,
  action,
}: UserStatusModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const isBlockAction = action === "block";
  const newStatus = isBlockAction ? "temporary_ban" : "active";
  const actionText = isBlockAction ? "Khóa" : "Mở khóa";
  const actionDescription = isBlockAction
    ? "khóa tài khoản này. Người dùng sẽ không thể đăng nhập hoặc sử dụng hệ thống."
    : "mở khóa tài khoản này. Người dùng sẽ có thể đăng nhập và sử dụng hệ thống bình thường.";

  const handleUpdateStatus = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      console.log("=== UPDATE USER STATUS ===");
      console.log("User ID:", user._id);
      console.log("Current Status:", user.accountStatus);
      console.log("Action:", action);
      console.log("New Status:", newStatus);

      const result = await updateUserStatus({
        id: user._id,
        status: newStatus,
      });

      console.log("Update result:", result);

      if (result.success) {
        toast.success(result.message || `${actionText} tài khoản thành công`);
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Update status error:", error);
      toast.error(
        error.message ||
          `Có lỗi xảy ra khi ${actionText.toLowerCase()} tài khoản`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-1 border-gray-600 sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isBlockAction ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Lock className="h-5 w-5 text-red-600" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Unlock className="h-5 w-5 text-green-600" />
              </div>
            )}
            <div>
              <DialogTitle className="text-white">
                {actionText} tài khoản
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Xác nhận thay đổi trạng thái tài khoản
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="rounded-lg bg-dark-2 p-4 border border-gray-600">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name?.charAt(0) || user.username?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-sm text-gray-400">@{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <div className="ml-auto">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    user.accountStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.accountStatus === "active" ? "Hoạt động" : "Bị khóa"}
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div
            className={`flex items-start gap-3 rounded-lg p-4 border ${
              isBlockAction
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 mt-0.5 ${
                isBlockAction ? "text-red-600" : "text-green-600"
              }`}
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  isBlockAction ? "text-red-800" : "text-green-800"
                }`}
              >
                Xác nhận {actionText.toLowerCase()}
              </p>
              <p
                className={`text-sm mt-1 ${
                  isBlockAction ? "text-red-700" : "text-green-700"
                }`}
              >
                Bạn có chắc chắn muốn {actionDescription}
              </p>
            </div>
          </div>

          {/* Status Change Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">
              Thay đổi trạng thái:
            </p>
            <div className="flex items-center justify-between rounded-lg bg-dark-2 p-3 border border-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Từ:</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    user.accountStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.accountStatus === "active" ? "Hoạt động" : "Bị khóa"}
                </span>
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Thành:</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    newStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {newStatus === "active" ? "Hoạt động" : "Bị khóa"}
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
              isBlockAction
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
