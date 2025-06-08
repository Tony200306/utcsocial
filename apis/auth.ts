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
