import axiosClient from "@/lib/userApi";
import { User } from "@/types/userType";
// types.ts
export interface UpdateUserPayload {
  userId: string;
  name: string;
  username: string;
  bio: string;
  profilePic: string | null;
  imgs: File[] | null;
}
// userApi.ts
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
export interface ResetPasswordPayload {
  token: string;
  password: string;
}
export const forgotPassword = async (
  {
    email,
  }: { email: string }
): Promise<User> => {
  const formData = new FormData();
  formData.append("email", email);
  const response = await axiosClient.post(`/users/forgot-password`, formData);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};

export const resetPassword = async ({
  token,
  password,
}: ResetPasswordPayload): Promise<{ message: string }> => {
  try {
    const response = await axiosClient.post(
      "/users/reset-password" + `/${token}`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // dùng nếu server cần cookie auth (có thể bỏ nếu không cần)
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data as { message: string };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to reset password"
    );
  }
};
export const changePassword = async ({
  currentPassword,
  newPassword,
}: ChangePasswordPayload): Promise<{ message: string }> => {
  try {
    const response = await axiosClient.post(
      "/users/changepassword",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // nếu bạn dùng cookie-based auth
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data as { message: string };
  } catch (error: any) {
    console.error("Error changing password:", error);
    throw new Error(error?.response?.data?.message || "Failed to change password");
  }
};


export const logout = async (): Promise<{ message: string }> => {
  const response = await axiosClient.post("/users/logout", {}, {
    withCredentials: true, // để gửi kèm cookie JWT
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data as { message: string };
};

export const updateUser = async (
  {
    userId,
    name,
    username,
    bio,
    profilePic,
    imgs,
  }: UpdateUserPayload
): Promise<User> => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("bio", bio);
  if (profilePic) formData.append("profilePic", profilePic);
  if (imgs) {
    imgs.forEach((img) => {
      formData.append("img", img);
    });
  }
  const response = await axiosClient.put(`/users`, formData);

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data as User;
};

export const updateUserOnboarded = async ({
  name,
  username,
  bio,
  img,
  interests,
}: {
  name: string;
  username: string;
  bio: string;
  img: File;
  interests: string[];
}): Promise<{ user: User }> => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("bio", bio);
  formData.append("img", img);

  // Append array as JSON string
  formData.append("interests", JSON.stringify(interests));

  const response = await axiosClient.post(`/users/onboarded`, formData);
  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data as { user: User };
};



export const followOrUnfollowUser = async ({
  id,
}: { id: string }): Promise<{ messesage: string }> => {
  try {
    // Gửi yêu cầu API follow/unfollow thread
    const response = await axiosClient.post(`/users/${id}/follow`);

    // Kiểm tra xem API có trả lỗi hay không
    if (response.data.error) {
      throw new Error(response.data.error);
    }


    // Trả về dữ liệu thread
    return response.data as { messesage: string };
  } catch (error) {
    console.error("Error in followOrUnfollowThread:", error);
    throw error;
  }
};

export const getUserById = async ({ id }: { id: string }): Promise<User> => {
  const response = await axiosClient.get(`/users/${id}`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as User;
};
export const getUserByCookies = async (): Promise<User> => {
  const response = await axiosClient.get(`/users`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as User;
};


export const top10FollowersUser = async (): Promise<User[]> => {
  const response = await axiosClient.get(`/users/suggested/top4FollowersUser`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data.users as User[];
};

export const usersIamFollowing = async (): Promise<User[]> => {
  const response = await axiosClient.get(`/users/suggested/usersIamFollow`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data.following as User[];
};


export const getUsersFollowingMe = async (): Promise<User[]> => {
  try {
    const response = await axiosClient.get(`/users/suggested/usersFollowingMe`);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.followers as User[];
  } catch (error: any) {
    console.error("Error fetching users following me:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch users following me");
  }
};