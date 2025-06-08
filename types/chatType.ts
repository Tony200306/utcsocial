import { User } from "./userType";

export type MessageType = {
    _id: string;
    conversationId: string; 
    text: string;
    seen: boolean;
    img: string;
    createdAt: string;
    updatedAt: string; 
    sender: string;
}
export type LastMessage = {
    text: string;
    sender: User;
    seen: boolean;
}
export type Conversationtype = {
    _id: string;
    participants: User[];
    lastMessage?: LastMessage;
    createdAt: string;
    updatedAt: string;
}
