'use client'
import React from 'react';
import { Menu, UserCircle2, X, LogOut } from 'lucide-react';
import Logo from '@/components/assets/logo/logo.png';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { logoutAdmin } from '@/redux/adminSlice';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/contexts/AlertContext';
import accountRefresher from '@/redux/accountRefresher';

const DashHead = () => {
    const [isMenu, setIsMenu] = React.useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { showAlert } = useAlert();
    const { firstName, lastName } = useSelector((state: RootState) => state.admin);


    accountRefresher('admin');
    const handleLogout = async () => {
        try {
            await dispatch(logoutAdmin()).unwrap();
            showAlert('Logged out successfully', 'success');
            router.push('/admin/login');
        } catch (error) {
            showAlert('Error logging out', 'error');
        }
    };

    return (
        <div className='relative w-full h-full px-4 flex justify-between items-center bg-gradient-to-l from-[bg-gradient-to-l from-black to-black/85'>
           <div className='flex flex-col w-full leading-[2px] md:leading-[4px]'>
                <div className="text-[1.8em] font-semibold text-orange-500">
                    <Image src={Logo} alt='logo' width={500} height={500} className='w-[100px] md:w-[120px] h-[50px] object-contain'/>
                </div>
                <span className='ml-[90px] md:ml-[120px] text-[.7em] md:text-[.8em] text-white/90'>Admin</span>
            </div>
            
            <div className='flex items-center gap-4 ml-auto'>
                <div className='flex items-center gap-2'>
                    <div className='hidden md:flex flex-col text-right'>
                        <span className='text-white text-[.8em] font-medium capitalize'>
                            {firstName} {lastName}
                        </span>
                        <span className='text-white/70 text-[.7em]'>
                            Administrator
                        </span>
                    </div>
                    <UserCircle2 className='text-white/80 w-7 h-7 md:w-10 md:h-10'/>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className='md:hidden flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 transition-colors'
                >
                    <LogOut className='w-7 h-7 text-red-500' />
                </button>
            </div>

        </div>
    );
};

export default DashHead;