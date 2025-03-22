'use client';

import {useSelector, useDispatch} from 'react-redux';
import {AppDispatch, RootState} from '@/redux/store';
import { login, logout, userSlicePayload } from "./userSlice";
import { useEffect, useState } from "react";
import { AxiosApi } from "@/lib/utils";
import { baseURL } from '@/../next.config';
import { UserState } from '@/types/chats';
import { User } from '@/features/admin/dashboard/api/conversationApi';
import { logoutAdmin } from './adminSlice';
import { useRouter } from 'next/navigation';


const accountRefresher =(account='user')=>{
  const dispatch = useDispatch<AppDispatch>();
    const router = useRouter(); 
    let isLoggedin :any;
    if(account=='admin'){
     isLoggedin =  useSelector((state: RootState) => state.admin.isLoggedIn);
    }else if (account =='agent'){
        isLoggedin =  useSelector((state: RootState) => state.agent.isLoggedIn);

    }else{
        isLoggedin =  useSelector((state: RootState) => state.user.isLoggedIn);
    }
   const [counter,setCounter] =useState(0);

    const fetchUserData = async () => {
        await AxiosApi(account).get(baseURL+"/profile")  
             .then((response: { data: any })=>{
                if (response.data) {
                    let data = response.data.data; 
                    const nameParts = data.name.split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.slice(1).join(' ') || '';
                dispatch(login({ 
                    isSubscribed:data.is_subscribed,
                    firstName: firstName,
                    lastName: lastName,
                    email: data.email,
                    phoneNumber: data.phone ? parseInt(data.phone) : null,
                    userId: data.id, 
                    accountType: data.account.slug,
                    apartments: data.apartments || [],
                    rentedApartments: data.rented_apartments || []
                }));
                setCounter(()=>0)
            }   
    }).catch ((error:any) => { 
        if(error.status==401){
            console.log('Authentication failed for '+account);
           if(counter>=2){
            logoutUserAutomatically(account); 
           } 
            setCounter(()=>counter+1);
        }
    })
    }
    const logoutUserAutomatically= async(account='user')=>{
            if(account=='admin'){
                await dispatch(logoutAdmin()).unwrap(); 
                router.push('/admin/login');
            }else if(account=='agent'){
                await dispatch(logout()); 
                router.push('/agents/auth/login');
            }else{  
              await  dispatch(logout());  return router.push('/');       
            }
       
    }


    useEffect(() => {
        if(isLoggedin){
        fetchUserData(); // Initial fetch
        const interval = setInterval(fetchUserData, 10 * 60 * 1000); // Refresh every 10 minutes
        return () => clearInterval(interval);
        }
        return ()=>{}
    }, [dispatch,isLoggedin]); 




}

export default accountRefresher;