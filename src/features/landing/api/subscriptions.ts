import { NextResponse } from 'next/server';
import axios from 'axios';
import {baseURL} from "@/../next.config"; 
import { PaginationLink } from '@/types/apartment';
import {redirect} from "next/navigation";
import {useSelector} from "react-redux";
import { ApiSubscriptionResponse } from '@/types/subscription';
import { AxiosApi } from '@/lib/utils';

   
  export const getUserSubscriptions = async (page: number = 1, search: string = '',account='user') => {
    try {
        

        const response = await AxiosApi(account).get<ApiSubscriptionResponse>(
            baseURL + `/subscriptions?page=${page}&search=${search}` );

        return response.data;
    } catch (error) {
        throw error;
    }
};
