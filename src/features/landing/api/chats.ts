import { ApiUserChatResponse } from "@/types/chats";
import { baseURL } from "@/../next.config";
import axios from "axios";

export const getUserConversations = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
 
        const response = await axios.get<ApiUserChatResponse>(
            baseURL + `/conversations`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};
