import axiosClient from "@/lib/userApi";
import { User } from "@/types/userType";

export const signinUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await axiosClient.post("/users/signin", {
    email,
    password,
  });
  if (response.data.token) {
    const token = response.data.token;

    // Thử set cookie
    try {
      document.cookie = `jwt=${token}; path=/; max-age=${15 * 24 * 60 * 60}; SameSite=none; Secure=true;Domain=572e-118-71-136-130.ngrok-free.app`;
      console.log('[SignIn] Cookie set manually:', document.cookie);
    } catch (e) {
      console.error('[SignIn] Failed to set cookie:', e);
    }
  }

  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as User;
};
export const signupUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await axiosClient.post("/users/signup", {
    email,
    password,
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as User;
};
