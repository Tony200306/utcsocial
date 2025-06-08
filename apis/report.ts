import axiosClient from "@/lib/userApi";
import { Report } from "@/types/reportType";

export const createReport = async (
  payload: Report
): Promise<{ success: boolean; report: Report }> => {
  const url = `/report/`;

  const response = await axiosClient.post(url, payload);

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data as { success: boolean; report: Report };
};
