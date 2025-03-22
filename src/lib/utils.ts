import axios, { Axios } from "axios";
import { type ClassValue, clsx } from "clsx"
import { formatDistanceToNow } from "date-fns";
import { redirect } from "next/navigation";

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
 
export const formatAmountNumber = (num:number|string|null|undefined) => {
  if(num){
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas for thousands
  }
  return 0;
};


export const setColor = (status:string) => {
    if (status == "success") {
        return 'text-green-300';
    }
    if (status == "reversed") {
        return 'text-blue-300';
    }
    if (status == "failed") {
        return 'text-red-300';
    }
    return " text-gray-700";
}

export const formatDate = (timestamp:any) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

export const extractClassName= (word:string)=>{
  return word.replace("App\\Models\\", "").replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function simpleDateFormat(date:any) {
  return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
  });
}


 


export const getCircularReplacer = ()=>{
  const seen = new WeakSet();
  return (key:any,value:any) =>{
    if(typeof value === "object" && value!==null){
      if(seen.has(value)){
        return;
      }
      seen.add(value);
    }
    return value;
  }
}

/////////////////////////// COOKIE ////////////////////////////////////////////
export function hasFormData(name:string) {
  const cookies = document.cookie.split("; ");
  return cookies.some(cookie => cookie.startsWith(`${name}=`));
}


export function saveFormData(name:string, data:any, duration = 30) {
  const expires = new Date();
  expires.setTime(expires.getTime() + duration * 24 * 60 * 60 * 1000); // Convert days to milliseconds
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(data,getCircularReplacer(),2))}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
}

export function getFormData(name:string) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
          return JSON.parse(decodeURIComponent(value));
      }
  }
  return null;
}

export function deleteFormData(name:string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


export const AxiosApi  =  (tokenFor='user') =>{
  //  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
  //  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  
  // const csrfTokenMeta = localStorage.getItem('token')??localStorage.getItem('agentToken')??localStorage.getItem('adminToken');
  // if (csrfTokenMeta) {
  //     axios.defaults.headers.Authorization = `Bearer ${ csrfTokenMeta}` ;
    
  // }  
  const instance = axios.create({
    withCredentials: true, // Ensure cookies are sent with requests
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  
let csrfTokenMeta;

  // Retrieve token dynamically
  if(tokenFor=='user'){
     csrfTokenMeta = localStorage.getItem('token') ;
  }else if(tokenFor=='agent'){
      csrfTokenMeta = localStorage.getItem('agentToken')  ;
  }else{
      csrfTokenMeta =localStorage.getItem('adminToken') ;
  } 

  if (csrfTokenMeta) {
    instance.defaults.headers.Authorization = `Bearer ${csrfTokenMeta}`;
  }

  return instance; 
}