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
  }): Promise<ThreadsListResponse> => {
    if (!query) throw new Error("Query parameter is required");
  
    const response = await axiosClient.get("/search/threads", {
      params: { query, pageNumber, pageSize },
    });
  
    if (response.data.error) {
      throw new Error(response.data.error);
    }
  
    return response.data as ThreadsListResponse;
};

export const fetchSearchSuggestions = async (search: string) => {
    const response = await axiosClient.get("/search/suggestions", {
      params: { query: search },
    });
    if (response.data.error) throw new Error(response.data.error);
    return response.data;
};