import axiosClient from "@/lib/userApi";
import { Conversationtype, MessageType } from "@/types/chatType";
type ConversationListResponse = {
    success: boolean;
    conversations: Conversationtype[];
};
export const getConversations = async (): Promise<ConversationListResponse> => {
    const response = await axiosClient.get("/messages/conversations", {
    });
    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data as ConversationListResponse;
};


export const getMessages = async (otherUserId: string): Promise<MessageType[]> => {
    const response = await axiosClient.get(`/messages/${otherUserId}`, {
    });
    console.log("response", response, otherUserId);
    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data as MessageType[];
};


export const sendMessages = async ({ text, otherUserId, image }: { text: string, otherUserId: string, image: File[] }): Promise<MessageType> => {
    const formData = new FormData();
    formData.append("message", text);
    formData.append("recipientId", otherUserId);

    // Append each file in the image array to the FormData object
    image.forEach((file, index) => {
        formData.append(`image`, file);
    });

    const response = await axiosClient.post(`/messages`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    console.log(image, "test");
    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data as MessageType;
};



export const createConversation = async (participantId: string) => {
    const response = await axiosClient.post("/messages/create-conversation", {
        participantId,
    });
    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data;
};