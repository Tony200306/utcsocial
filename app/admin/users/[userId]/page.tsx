"use client";

import { useQuery } from "react-query";
import { getUserById } from "@/apis/user";
import { User } from "@/types/userType";
import { UserStatusModal } from "./components/UserStatusModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, User as UserIcon, Mail, Calendar, Users, BookOpen, Eye, Heart, Shield } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDetailsPage({
  params,
}: Readonly<{ params: { userId: string } }>) {
  const userId = params.userId;

  // States cho modals
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch, // Để refresh data sau khi update
  } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUserById({ id: userId }),
    enabled: !!userId,
  });

  const handleSuccess = () => {
    // Refresh user data sau khi cập nhật thành công
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Error fetching user details.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isUserBlocked = user?.accountStatus === "temporary_ban";

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user account and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user?.profilePic} alt={user?.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
              <p className="text-gray-500 mb-3">@{user?.username}</p>
              
              <Badge variant={user?.accountStatus === "active" ? "default" : "destructive"} className="mb-4">
                {user?.accountStatus === "active" ? "Hoạt động" : "Bị khóa"}
              </Badge>

              {user?.bio && (
                <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm text-gray-600">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Role:</span>
                    <Badge variant="outline">{user?.role}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">User ID:</span>
                    <span className="text-sm text-gray-600 font-mono">{user?._id}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Created:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Updated:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(user?.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Onboarded:</span>
                    <Badge variant={user?.onboarded ? "default" : "secondary"}>
                      {user?.onboarded ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{user?.followers?.length || 0}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{user?.following?.length || 0}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{user?.reposts?.length || 0}</p>
                  <p className="text-sm text-gray-600">Reposts</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Heart className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{user?.saves?.length || 0}</p>
                  <p className="text-sm text-gray-600">Saved</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{user?.blockedUsers?.length || 0}</p>
                  <p className="text-sm text-gray-600">Blocked Users</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <Eye className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-indigo-600">{user?.viewedThreads?.length || 0}</p>
                  <p className="text-sm text-gray-600">Viewed Threads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Actions */}
          <Card>
            <CardHeader>
              <CardTitle>User Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setIsUnblockModalOpen(true)}
                    disabled={!isUserBlocked}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 flex-1"
                    size="lg"
                  >
                    <Unlock className="mr-2 h-4 w-4" />
                    Mở khóa người dùng
                  </Button>

                  <Button
                    onClick={() => setIsBlockModalOpen(true)}
                    disabled={isUserBlocked}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 flex-1"
                    size="lg"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Khóa người dùng
                  </Button>
                </div>

                <div className={`p-4 rounded-lg flex items-center gap-2 text-sm ${
                  isUserBlocked 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {isUserBlocked ? (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>⚠️ Tài khoản này hiện đang bị khóa</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      <span>✅ Tài khoản này đang hoạt động bình thường</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Mở khóa */}
      <UserStatusModal
        user={user || null}
        isOpen={isUnblockModalOpen}
        onClose={() => setIsUnblockModalOpen(false)}
        onSuccess={handleSuccess}
        action="unblock"
      />

      {/* Modal Khóa */}
      <UserStatusModal
        user={user || null}
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onSuccess={handleSuccess}
        action="block"
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
