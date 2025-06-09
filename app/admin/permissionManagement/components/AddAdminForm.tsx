"use client";

import { updateUserRole } from "@/apis/admin";
import { fetchSearchSuggestions } from "@/apis/search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/userType";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";

interface AddAdminFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function AddAdminForm({ onSuccess, onClose }: AddAdminFormProps) {
  const [search, setSearch] = useState("");
  console.log("AddAdminForm rendered with search:", search);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Query để tìm kiếm users
  const { data: searchResults = [], isFetching } = useQuery(
    ["searchUsers", search],
    () => fetchSearchSuggestions(search),
    {
      enabled: !!search && search.length > 1,
      staleTime: 1 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Handle chọn user
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearch(user.name || user.username);
    // Reset role khi chọn user mới
    setSelectedRole("");
  };

  // Handle update role
  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Vui lòng chọn người dùng và quyền");
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateUserRole({
        id: selectedUser._id,
        role: selectedRole,
      });

      if (result.success) {
        toast("Cập quyền thành công", {
          description: "Hãy kiểm tra email của bạn để cập nhật mật khẩu mới.",
          action: {
            label: "Dismiss",
            onClick: () => {},
          },
        });
        onSuccess?.();
        onClose?.();
        // Reset form
        setSelectedUser(null);
        setSelectedRole("");
        setSearch("");
      }
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật quyền");
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset search khi clear
  const handleClearSearch = () => {
    setSearch("");
    setSelectedUser(null);
    setSelectedRole("");
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-white">Thêm người quản trị</DialogTitle>
      </DialogHeader>

      {/* Search User Input */}
      <div className="space-y-2">
        <Label htmlFor="search-user" className="text-white">
          Tìm kiếm người dùng
        </Label>
        <div className="relative">
          <Input
            id="search-user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tên hoặc username..."
            className="bg-dark-2 text-white border-gray-600"
          />
          {search && !selectedUser && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="  text-white absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={handleClearSearch}
            >
              ✕
            </Button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {search && !selectedUser && (
          <div className="relative">
            {isFetching ? (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-dark-2 border border-gray-600 shadow-lg">
                <p className="p-3 text-gray-400 text-sm">Đang tìm kiếm...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-dark-2 border border-gray-600 shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((user: User) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 hover:bg-dark-3 cursor-pointer border-b border-gray-700 last:border-b-0"
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePic} alt="avatar" />
                      <AvatarFallback className="bg-gray-600 text-white">
                        {user.name?.charAt(0) || user.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {user.name}
                      </span>
                      <span className="text-gray-400 text-sm">
                        @{user.username}
                      </span>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : search.length > 1 ? (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-dark-2 border border-gray-600 shadow-lg">
                <p className="p-3 text-gray-400 text-sm">
                  Không tìm thấy kết quả
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Selected User Display */}
      {selectedUser && (
        <div className="space-y-2">
          <Label className="text-white">Người dùng đã chọn</Label>
          <div className="flex items-center gap-3 p-3 bg-dark-3 rounded-md border border-gray-600">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser.profilePic} alt="avatar" />
              <AvatarFallback className="bg-gray-600 text-white">
                {selectedUser.name?.charAt(0) ||
                  selectedUser.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-white font-medium">
                {selectedUser.name}
              </span>
              <span className="text-gray-400 text-sm">
                @{selectedUser.username}
              </span>
              <span className="text-xs text-gray-500">
                Quyền hiện tại: {selectedUser.role}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto text-white"
              onClick={handleClearSearch}
              color="white"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Role Selection */}
      {selectedUser && (
        <div className="space-y-2">
          <Label htmlFor="role-select" className="text-white">
            Chọn quyền mới
          </Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="bg-dark-2 text-white border-gray-600">
              <SelectValue placeholder="Chọn quyền..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isUpdating}>
          Hủy
        </Button>
        <Button
          onClick={handleUpdateRole}
          disabled={!selectedUser || !selectedRole || isUpdating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isUpdating ? "Đang cập nhật..." : "Cập nhật quyền"}
        </Button>
      </div>
    </div>
  );
}
