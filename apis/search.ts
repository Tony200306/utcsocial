import axiosClient from "@/lib/userApi";
import { ThreadsListResponse } from "@/types/threadType";
export const getThreadsBySearch = async ({
  query,
  pageNumber = 1,
  pageSize = 20,
}: {
  query: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<ThreadsListResponse & { totalCount: number }> => {
  if (!query || query.trim() === "") {
    throw new Error("Search query is required");
  }

  const response = await axiosClient.get("/search/threads", {
    params: { q: query.trim(), pageNumber, pageSize },
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data as ThreadsListResponse & { totalCount: number };
};
export const fetchSearchSuggestions = async (search: string) => {
  const response = await axiosClient.get("/search/suggestions", {
    params: { query: search },
  });
  if (response.data.error) throw new Error(response.data.error);
  return response.data;
};
