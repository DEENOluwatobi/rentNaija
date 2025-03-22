"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpenText, CirclePlus, CircleUser, Home, LogOut, Mail, ContactRound, LayoutGrid, Users, AtSign, Globe, ShoppingBag, BuildingIcon, Building2Icon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { logoutAdmin } from '@/redux/adminSlice';
import { useAlert } from '@/contexts/AlertContext';
import Logo from '@/components/assets/logo/logo.png';
import Image from 'next/image';

const Sidenav = () => {
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { showAlert } = useAlert();

    const handleLogout = async () => {
        try {
            await dispatch(logoutAdmin()).unwrap();
            showAlert('Logged out successfully', 'success');
            router.push('/admin/login');
        } catch (error) {
            showAlert('Error logging out', 'error');
        }
    };

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
        <div className='px-4 py-6 w-full h-full bg-black/85 text-white'>
          
            <div className='flex flex-col w-full leading-[4px]'>
                <div className="text-[1.8em] font-semibold text-orange-500">
                    <Image src={Logo} alt='logo' width={500} height={500} className='w-[120px] h-[50px] object-contain'/>
                </div>
                <span className='ml-[120px] text-[.8em] text-white/90'>Admin</span>
            </div>  
            <div className='flex flex-col overflow-y-auto max-h-[550px] pb-[50px] px-2'>
                

            <div className='py-20 flex flex-col gap-4'>
                {links.map((link, index) => (
                    <Link href={link.link} key={index} className='w-full'>
                        <div className={`flex items-center gap-2 p-2 text-[.8em] rounded-lg ${pathname === link.link ? "bg-green-500 text-white" : "text-white bg-black"}`}>
                            <link.icon className='w-6 h-6'/>
                            <span>{link.name}</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className='mt-auto flex w-full'>
                <button 
                    onClick={handleLogout}
                    className='w-full flex items-center gap-2 p-2 mt-2 rounded-lg hover:bg-red-500 bg-red-500/50 transition-colors'
                >
                    <LogOut className='w-6 h-6 text-white' />
                    <span className='text-white text-[.9em]'>Logout</span>
                </button>
            </div>
            </div>
        </div>
    )
}

export default Sidenav