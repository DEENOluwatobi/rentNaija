import { User } from "@/features/admin/dashboard/api/conversationApi";
import { PaginationLink } from "./apartment";

export interface ChatDialogProps {
    agentId: number;
    agentName?: string;
}

export interface Message {
    id: number;
    from_id: string;
    to_id: string;
    message: string;
    created_at: string;
    updated_at: string;
    to?:User;
    from?:User;
}

export interface UserState {
    isLoggedIn: boolean;
    userId?: number;
    token?: string;
}

export interface RootState {
    user: UserState;
}


export interface ApiUserChatResponse{
    success: boolean;
      message: string;
       data: Message[]|[]|null|undefined;
       
}