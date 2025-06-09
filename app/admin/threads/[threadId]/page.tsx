"use client";

import { useQuery } from "react-query";
import { getThreadById } from "@/apis/admin";
import { Thread } from "@/types/threadType";
import {
  Calendar,
  MessageCircle,
  Heart,
  Repeat,
  Share,
  Eye,
  EyeOff,
  Edit,
  Trash2,
} from "lucide-react";
import { ThreadStatusModal } from "./components/ThreadStatusModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export default function ThreadDetailsPage({
  params,
}: Readonly<{ params: { threadId: string } }>) {
  const threadId = params.threadId;

  // States cho modals
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);

  const {
    data: thread,
    isLoading,
    error,
    refetch, // Để refresh data sau khi update
  } = useQuery<Thread>({
    queryKey: ["thread", threadId],
    queryFn: () => getThreadById({ id: threadId }),
    enabled: !!threadId,
  });

  const handleSuccess = () => {
    // Refresh thread data sau khi cập nhật thành công
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium">
            Error fetching thread details
          </p>
        </div>
      </div>
    );
  }

  const isThreadHidden = thread?.isHidden;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Thread Details</h1>
          <div className="flex items-center space-x-2">
            {thread?.isHidden ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <EyeOff className="w-3 h-3 mr-1" />
                Hidden
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Eye className="w-3 h-3 mr-1" />
                Visible
              </span>
            )}
          </div>
        </div>

        {/* Thread Info */}
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">ID:</span>
            <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {thread?._id}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(thread?.createdAt || "").toLocaleDateString()}
            </div>
            <div>
              <strong>@{thread?.postedBy.username}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Thread Content */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-200 p-6 ring-2 ring-blue-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
            Thread Content
          </h2>
          <p className="text-gray-900 text-lg leading-relaxed font-medium bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            {thread?.text}
          </p>
        </div>

        {/* Images */}
        {thread?.imgs && thread.imgs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {thread.imgs.map((img, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg border"
                >
                  <img
                    src={img}
                    alt={`Thread Image ${index + 1}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <MessageCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {thread?.commentCount || 0}
            </div>
            <div className="text-sm text-blue-600">Comments</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {thread?.likeCount || 0}
            </div>
            <div className="text-sm text-red-600">Likes</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Share className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {thread?.shareCount || 0}
            </div>
            <div className="text-sm text-purple-600">Shares</div>
          </div>
        </div>

        {/* Actions với Modal */}
        <div className="space-y-4">
          <div className="flex space-x-3"></div>

          {/* Thread Status Controls */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Thread Visibility Controls
            </h3>

            <div className="flex gap-4">
              {/* Nút Hiện Thread */}
              <Button
                onClick={() => setIsShowModalOpen(true)}
                disabled={!isThreadHidden}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Hiện thread
              </Button>

              {/* Nút Ẩn Thread */}
              <Button
                onClick={() => setIsHideModalOpen(true)}
                disabled={isThreadHidden}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 flex items-center"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Ẩn thread
              </Button>
            </div>

            {/* Status info */}
            <div className="text-sm text-gray-600 mt-2">
              {isThreadHidden ? (
                <p>⚠️ Thread này hiện đang bị ẩn khỏi công chúng</p>
              ) : (
                <p>✅ Thread này đang hiển thị công khai</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hiện Thread */}
      <ThreadStatusModal
        thread={thread || null}
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        onSuccess={handleSuccess}
        action="show"
      />

      {/* Modal Ẩn Thread */}
      <ThreadStatusModal
        thread={thread || null}
        isOpen={isHideModalOpen}
        onClose={() => setIsHideModalOpen(false)}
        onSuccess={handleSuccess}
        action="hide"
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
