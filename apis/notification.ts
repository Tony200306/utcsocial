import axiosClient from "@/lib/userApi";
import { Notification } from "@/types/notification";



export const getNotifications = async (): Promise<Notification> => {
    const response = await axiosClient.get("/notifications");
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.notifications as Notification;
  };