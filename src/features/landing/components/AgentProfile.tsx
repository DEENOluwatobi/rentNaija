'use client';
import { User } from "@/features/admin/dashboard/api/userApi";
import { AxiosApi } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AgentProfileInt{
    agentId:number
}

const AgentProfile = ({agentId}:AgentProfileInt)=>{

    const [agent ,setAgent] = useState<User>();
    const [isLoading , setIsLoading] = useState(false);

    const fetchAgent=async ()=>{
        
    }

useEffect(()=>{
    fetchAgent();
},[agentId])
    
    return <>
    </>
}


export default AgentProfile;