'use client';
import React, {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '@/redux/store';
import {Menu, X, LogOut, UserCircle2} from 'lucide-react';
import {motion} from 'framer-motion';
import {logout} from '@/redux/userSlice';
import Image from 'next/image';
import Logo from '@/components/assets/logo/logo.png'
import accountRefresher from '@/redux/accountRefresher';

const Header = () => {
    const pathname = usePathname();
    const [isMenu, setIsMenu] = useState(false);
    const [isUserMenu, setIsUserMenu] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();

    const toggleMenu = () => setIsMenu((prev) => !prev);
const toggleUserMenu = () => setIsUserMenu((prev) => !prev);

    // useEffect(()=>{

    // },[user.isLoggedIn]);
    accountRefresher(); // Automatically refresh user state

    
    const links = useMemo(() => {
        const baseLinks = [
            { title: 'Home', link: '/' },
            { title: 'Find Homes', link: '/find-homes' },
            { title: 'About', link: '/about' },
            { title: 'Contact Us', link: '/contact' },
        ];
        if (user.isLoggedIn && !['agents', 'admins'].includes(String(user.accountType))) {
            return [...baseLinks, { title: 'Chats', link: '/user/chat' }, { title: 'Rents', link: '/user/rent' }, { title: 'Subscriptions', link: '/user/subscriptions' }];
        }
        return baseLinks;
    }, [user.isLoggedIn, user.accountType]);
    
    const handleLogout = () => {
        dispatch(logout());  return router.push('/');
    };

    const getUserIdDisplay = () => {
        const storedState = localStorage.getItem('userState');
        const parsedState = storedState ? JSON.parse(storedState) : null;
        const storedUserId = parsedState?.userId;

        const effectiveUserId = user.userId || storedUserId;
        return effectiveUserId ? ` (ID: ${effectiveUserId})` : '';
    };

    return (
        <div
            className="fixed top-0 left-0 w-full bg-black bg-opacity-70 backdrop-blur-md z-[99] px-2 py-2 md:px-4 md:py-4 flex justify-between items-center">
            <Link href="/" className="">
                <Image src={Logo} alt='logo' width={500} height={500} className='w-[120px] h-[50px] object-contain'  priority={false}/>
            </Link>

            <div className="hidden lg:flex justify-center items-center gap-10 text-white">
                {links.map((link, index) => (
                    <div key={index} className="relative group">
                        <Link
                            href={link.link}
                            className={`${
                                pathname === link.link || pathname?.startsWith(`${link.link}/`) ? 'text-orange-500' : ''
                            } duration-200 ease-in-out transition-all`}
                        >
                            {link.title}
                        </Link>

                        <div
                            className={`${
                                pathname === link.link || pathname?.startsWith(`${link.link}/`)
                                    ? 'w-6 bg-green-500'
                                    : 'w-0 group-hover:w-full group-hover:scale-x-50 bg-orange-500'
                            } absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-[3px] 
                  transition-all duration-300 origin-center`}
                        ></div>
                    </div>
                ))}
            </div>

            <div className="hidden lg:flex justify-center items-center gap-4">
                {user.isLoggedIn ? (
                    <div className="flex items-center gap-4">

                        <div className='relative'>
                            <div onClick={() => setIsUserMenu(true)} className='cursor-pointer'>
                                <UserCircle2 className='text-white w-10 h-10'/>
                            </div>
                            {
                                isUserMenu && (
                                    <motion.div
                                        initial={{x: 0, opacity: 0}}
                                        animate={{x: 0, opacity: 1}}
                                        className='w-[250px] flex flex-col gap-4 py-6 px-4 rounded-l-xl fixed top-0 right-0 h-screen z-50 bg-black/90'
                                    >
                                        <div className='w-full justify-end flex'>
                                            <div onClick={() => setIsUserMenu(false)}
                                                 className='cursor-pointer border-2 rounded-full w-10 h-10 flex items-center justify-center'>
                                                <X className='text-white w-6 h-6'/>
                                            </div>
                                        </div>

                                        <span className="text-orange-500 font-semibold">
                      Welcome, {user.firstName} {user.lastName}
                    </span>

                                        {String(user.accountType) === 'agents' && (
                                            <Link href='/agents/dashboard'
                                                  className="text-sm mt-5 flex items-center gap-2 bg-white hover:bg-green-500 border border-green-500 text-green-500 hover:text-white px-4 py-2 rounded-md transition-all duration-300">
                                                Go to Agent Dashboard
                                            </Link>
                                        )
                                        }

                                        {String(user.accountType) === 'admins' && (
                                            <Link href='/admin/dashboard'
                                                  className="text-sm mt-5 flex items-center gap-2 bg-white hover:bg-green-500 border border-green-500 text-green-500 hover:text-white px-4 py-2 rounded-md transition-all duration-300">
                                                Go to Admin Dashboard
                                            </Link>
                                        )
                                        }

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 hover:bg-transparent border hover:border-red-500 hover:text-red-500 bg-red-500 text-white px-4 py-2 rounded-md transition-all duration-300"
                                        >
                                            <LogOut className="w-4 h-4"/>
                                            Logout
                                        </button>
                                    </motion.div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className='flex gap-2'>
                        <Link
                            href="/auth/login"
                            className="bg-transparent border border-orange-500 text-orange-500 hover:bg-white px-4 py-2 rounded-md transition-all duration-300"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="bg-orange-500 text-white px-4 py-2 rounded-md transition-all duration-300"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>

            <div className="lg:hidden flex justify-center items-center gap-4">
                <div onClick={() => setIsMenu(true)}>
                    <Menu className='w-7 h-7 text-orange-500'/>
                </div>


                {isMenu && (
                    <motion.div
                        initial={{x: 0, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        className='w-[200px] flex flex-col gap-10 py-20 px-4 rounded-l-xl fixed top-0 right-0 h-screen z-50 bg-black/70'
                    >
                        <div
                            onClick={() => setIsMenu(false)}
                            className='absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex justify-center items-center'
                        >
                            <X className='w-5 h-5 text-orange-500'/>
                        </div>

                        <div className="flex flex-col justify-start items-end gap-2 text-white text-[.9em]">
                            {links.map((link, index) => (
                                <div key={index} className="relative group">
                                    <Link
                                        href={link.link}
                                        className={`${
                                            pathname === link.link ? 'text-orange-500' : ''
                                        } duration-200 ease-in-out transition-all`}
                                    >
                                        {link.title}
                                    </Link>

                                    <div
                                        className={`${
                                            pathname === link.link
                                                ? 'w-6 bg-green-500'
                                                : 'w-0 group-hover:w-full group-hover:scale-x-50 bg-orange-500'
                                        } absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-[3px] 
                          transition-all duration-300 origin-center`}
                                    ></div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col justify-start items-end gap-2 text-[.8em]">
                            {user.isLoggedIn ? (
                                <>
                    <span className="text-orange-500 font-semibold">
                      Welcome, {user.firstName}
                    </span>
                                    {/* <Link href='' className="flex items-center gap-2 bg-white border border-red-500 text-green-500 hover:text-white px-4 py-2 rounded-md transition-all duration-300">
                      My Apartments
                    </Link> */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md transition-all duration-300"
                                    >
                                        <LogOut className="w-4 h-4"/>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className='flex flex-col gap-2 w-full'>
                                    <Link
                                        href="/auth/login"
                                        className="bg-transparent border border-orange-500 text-orange-500 hover:bg-white px-8 py-2 rounded-md transition-all duration-300"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/auth/signup"
                                        className="bg-orange-500 text-white px-8 py-2 rounded-md"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Header;