'use client'
import React from 'react';
import Header from "@/features/landing/components/Header";
import Footer from "@/features/landing/components/Footer";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Header/>
            {children}
            <Footer/>
        </div>
    );
}