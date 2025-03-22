"use client"
import React, { useState } from 'react';
import { usePathname } from 'next/navigation'; 
import { Inter } from "next/font/google";
import { motion } from 'framer-motion';
import House from '@/components/assets/house2.jpeg';
import { ScrollArea } from '@/components/ui/scrollArea';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isLoginPage = pathname === '/auth/login';
  const isSignupPage = pathname === '/auth/signup';

  const [isPageVisible, setIsPageVisible] = useState(false);

  return ( 
      <body className={inter.className}>
        {/* LARGER SCREEN */}
        <div className="hidden lg:flex h-screen w-full"> 
          {isLoginPage && (
            <>
                <motion.div
                className="relative z-10 flex-1 md:overflow-hidden"
                initial={{ x: '100%', borderBottomRightRadius: '0px', borderTopLeftRadius: '15%' }}  
                animate={{ x: '0%', borderBottomRightRadius: '15%', borderTopLeftRadius: '0px' }}   
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ width: '60%' }}  
                onAnimationComplete={() => setIsPageVisible(true)} 
                >
                    <img 
                    src={House.src} 
                    alt="Auth Background"
                    className="w-full h-full object-cover"
                    />
                </motion.div>

                <motion.div
                className="flex-1 flex items-center justify-center"
                initial={{ x: '-100%' }}  
                animate={{ x: '0%' }}     
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ width: '40%' }}  
                >
                  <div className='w-full'>
                    {React.cloneElement(children as React.ReactElement, { isPageVisible })}
                  </div>
                </motion.div>
            </>
          )}

          
          {isSignupPage && (
            <>        
                <motion.div
                initial={{ x: '0%', borderTopLeftRadius: '0px', borderBottomRightRadius: '15%' }}  
                animate={{ x: '100%', borderTopLeftRadius: '15%', borderBottomRightRadius: '0px' }}     
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ width: '60%', height: '100%' }}   
                className="relative z-10 flex-1 md:overflow-hidden"
                onAnimationComplete={() => setIsPageVisible(true)} 
                >
                    <img 
                    src={House.src} 
                    alt="Auth Background"
                    className="w-full h-full object-cover"
                    />
                </motion.div>

                <motion.div
                className="flex-1 flex items-center justify-center"
                initial={{ x: '0%' }}  
                animate={{ x: '-100%' }}    
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ width: '60%' }}  
                >
                  <ScrollArea className='w-full h-screen'>
                    {React.cloneElement(children as React.ReactElement, { isPageVisible })}
                  </ScrollArea>
                </motion.div>
            </>
          )}
        </div>

        {/* MOBILE SCREEN */}
        <div className="lg:hidden flex h-full w-full px-4 sm:w-[70%] mx-auto"> 
          <motion.div
          className="flex-1 flex items-center justify-center overflow-scroll"
          initial={{ x: '-100%' }}  
          animate={{ x: '0%' }}     
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ width: '100%' }}  
          >
            <div className='w-full'>
              {React.cloneElement(children as React.ReactElement, { isPageVisible })}
            </div>
          </motion.div>
        </div>
      </body> 
  );
}
