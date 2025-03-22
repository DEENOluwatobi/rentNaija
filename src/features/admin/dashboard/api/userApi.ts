import axios from 'axios';
import {baseURL} from "@/../next.config";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  business_name?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  profile_photo_path:string|null;
  business_logo?:string;
  business_email?: string | null;
  business_phone?: string | null;
  business_address?: string | null;
  account?: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
}

export interface PaginatedResponse {
  current_page: number;
  data: User[];
  total: number;
  per_page: number;
}

// API functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
};

export const getUsers = async (page = 1, search = '', accountType: 'users' | 'agents' = 'users') => {
  const response = await axios.get<{ data: PaginatedResponse }>(
    `${baseURL}/users`,
    {
      headers: getAuthHeaders(),
      params: {
        page,
        per_page: 20,
        search,
        account_type: accountType
      },
    }
  );
  return response.data.data;
};

export const getUser = async (id: number) => {
  const response = await axios.get<{ data: User }>(
    `${baseURL}/user/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data.data;
};

export const createUser = async (userData: Partial<User>) => {
  const response = await axios.post(
    `${baseURL}/user`,
    userData,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

export const updateUser = async (id: number, userData: Partial<User>) => {
  const response = await axios.put(
    `${baseURL}/user/${id}`,
    userData,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await axios.delete(
    `${baseURL}/user/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};