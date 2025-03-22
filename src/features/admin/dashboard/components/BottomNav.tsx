"use client"
import React from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpenText, CirclePlus, CircleUser, Home, LogOut, Mail, ContactRound, LayoutGrid, Users, AtSign, Globe, ShoppingBag, BuildingIcon, Building2Icon } from 'lucide-react';

const BottomNav = () => {
    const pathname = usePathname();

    const links = [
        {
            name: "Overview", 
            link: "/admin/dashboard",
            icon: Home,
        },
        {
            name: "View Users", 
            link: "/admin/dashboard/view-users",
            icon: ContactRound,
        },
        {
            name: "View Agents", 
            link: "/admin/dashboard/view-agents",
            icon: Users,
        },
        {
            name: "View Apartment",
            link: "/admin/dashboard/view-apartments",
            icon: LayoutGrid,
        },
        {
            name: "Subscriptions",
            link: "/admin/dashboard/view-subscriptions",
            icon: ShoppingBag,
        },
        {
            name: "Access Rents", 
            link: "/admin/dashboard/access-rents",
            icon: Building2Icon,
        },
        {
            name: "Message", 
            link: "/admin/dashboard/messages",
            icon: Mail,
        },
        {
            name: "Go to Website", 
            link: "/",
            icon: Globe,
        },
        
        // {
        //     name: "Profile", 
        //     link: "/admin/dashboard/profile",
        //     icon: CircleUser,
        // },
    ]

    return (
        <div className='px-4 py-2 w-full h-full bg-black/85 text-white flex flex-col overflow-x-auto'>
            <div className='flex justify-center items-center gap-6 sm:gap-8 md:gap-14'>
                {links.map((link, index) => (
                    <Link href={link.link} key={index} className=''>
                        <div className={`flex flex-col items-center ${pathname === link.link ? "text-green-500" : "text-white"}`}>
                            <link.icon className='w-6 h-6'/>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default BottomNav