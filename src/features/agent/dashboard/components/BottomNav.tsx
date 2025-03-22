"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpenText, Building2Icon, CirclePlus, CircleUser, Globe, Home, Mail } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/agentSlice';

const BottomNav = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/agents/auth/login');
    };

    const links = [
        {
            name: "Dashboard", 
            link: "/agents/dashboard",
            icon: Home,
        },
        {
            name: "Add Property", 
            link: "/agents/dashboard/add-property",
            icon: CirclePlus,
        },
        {
            name: "Manage Property", 
            link: "/agents/dashboard/manage-property",
            icon: BookOpenText,
        },
         {
                    name: "Manage Rent", 
                    link: "/agents/dashboard/manage-rent",
                    icon: Building2Icon,
        },
        {
            name: "Message", 
            link: "/agents/dashboard/messages",
            icon: Mail,
        },
        // {
        //     name: "Profile", 
        //     link: "/agents/dashboard/profile",
        //     icon: CircleUser,
        // },
        {
            name: "Go to Rent9ja", 
            link: "/",
            icon: Globe,
        },
    ]

    return (
        <div className='px-4 py-2 w-full h-full bg-black/85 text-white flex overflow-x-auto'>
            <div className='w-full flex justify-center items-center gap-8 md:gap-14'>
                {links.map((link, index) => (
                    <Link href={link.link} key={index} className=''>
                        <div className={`flex flex-col items-center ${pathname === link.link ? "text-orange-500" : "text-white"}`}>
                            <link.icon className='w-7 h-7'/>
                        </div>
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className=" flex items-center text-red-600 hover:text-white"
                    >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-7 w-7" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default BottomNav