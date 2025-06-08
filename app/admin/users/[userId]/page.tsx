"use client";

import { useQuery } from "react-query";
import { getUserById } from "@/apis/user"; // API để lấy thông tin người dùng
import { User } from "@/types/userType"; // Import kiểu dữ liệu User

export default function UserDetailsPage({ params }: Readonly<{ params: { userId: string } }>) {
  const userId = params.userId; // Lấy userId từ URL

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUserById({ id: userId }),
    enabled: !!userId,
  });

  if (isLoading) return <p>Loading user details...</p>;
  if (error) return <p>Error fetching user details.</p>;

  return (
    <section className="p-10">
      <h1 className="mb-4 text-xl font-bold">User Details</h1>

      {/* General information */}
      <div className="mb-6">
        <p><strong>User ID:</strong> {user?._id}</p>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Username:</strong> @{user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Account Status:</strong> {user?.accountStatus}</p>
        <p><strong>Created At:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated At:</strong> {new Date(user?.updatedAt).toLocaleDateString()}</p>
      </div>

      {/* Profile picture */}
      {user?.profilePic && (
        <div className="mb-6">
          <p><strong>Profile Picture:</strong></p>
          <img
            src={user.profilePic}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full object-cover mt-2"
          />
        </div>
      )}

      {/* Bio */}
      {user?.bio && (
        <div className="mb-6">
          <p><strong>Bio:</strong> {user.bio}</p>
        </div>
      )}

      {/* Followers and Following */}
      <div className="mb-6">
        <p><strong>Followers:</strong> {user.followers.length}</p>
        <p><strong>Following:</strong> {user.following.length}</p>
      </div>

      {/* Additional information */}
      <div>
        <h2 className="text-lg font-semibold">Additional Information</h2>
        <ul className="mt-4">
          <li><strong>Onboarded:</strong> {user.onboarded ? "Yes" : "No"}</li>
          <li><strong>Reposts:</strong> {user.reposts.length}</li>
          <li><strong>Saved Threads:</strong> {user.saves.length}</li>
          <li><strong>Blocked Users:</strong> {user.blockedUsers.length}</li>
          <li><strong>Viewed Threads:</strong> {user.viewedThreads.length}</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
          Edit User
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded">
          Delete User
        </button>
      </div>
    </section>
  );
}
