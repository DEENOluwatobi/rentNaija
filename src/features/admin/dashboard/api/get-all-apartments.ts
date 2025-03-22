import axios from 'axios';
import {baseURL} from "@/../next.config";

export interface Apartment {
    id: number;
    agent: string;
    agent_email: string;
    category: string;
    title: string;
    description: string;
    number_of_rooms: string;
    amount: string;
    duration: string;
    state_code: string;
    published: boolean ;
    can_rate: boolean;
    city_code: string;
    images: Record<string, {
        preview_url: string;
        original_url: string;
    }>;
    videos: Record<string, {
        original_url: string;
    }>;
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: Apartment[];
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: PaginationData;
}

export const getAllApartments = async (page: number = 1, search: string = '') => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get<ApiResponse>(
            baseURL + `/apartments?page=${page}&search=${search}`,
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

export const deleteApartment = async (id: number) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.delete(
            baseURL + `/apartment/${id}`,
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
export const updateApartment = async (id: number, data: object) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.put(
            baseURL + `/apartment/${id}`,
            data,
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