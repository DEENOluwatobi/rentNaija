"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpenText, Building2Icon, CirclePlus, CircleUser, Globe, Home, Mail } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/assets/logo/logo.png'
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/agentSlice';

const Sidenav = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

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

    const handleLogout = () => {
        dispatch(logout());
        router.push('/agents/auth/login');
    };

    return (
        <div className='px-4 py-6 w-full h-full bg-black/85 text-white flex flex-col'>
            <div className='flex flex-col w-full leading-3'>
                <div>
                    <Image src={Logo} alt='logo' width={500} height={500} className='w-[120px] h-[50px] object-contain'/>
                </div>
                <span className='ml-[120px] text-[.8em] text-white/90'>Agent</span>
            </div>
            <div className='flex flex-col overflow-y-auto max-h-[550px] pb-[50px] px-2'>
            <div className='py-20 flex flex-col gap-4'>
                {links.map((link, index) => (
                    <Link href={link.link} key={index} className='w-full'>
                        <div className={`flex items-center gap-2 p-2 text-[.8em] rounded-lg ${pathname === link.link ? "bg-orange-500 text-white" : "text-white bg-black"}`}>
                            <link.icon className='w-6 h-6'/>
                            <span>{link.name}</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className='w-full mt-auto'>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-red-600 hover:text-white hover:bg-red-500 bg-white rounded-lg transition-colors"
                    >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6 mr-2" 
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
                    <span>Logout</span>
                </button>
            </div>
            </div>
        </div>
    )
}

export default Sidenav