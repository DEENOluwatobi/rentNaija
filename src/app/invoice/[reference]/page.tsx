import { Suspense } from 'react';
import ApartmentClient from '@/features/landing/components/ApartmentClient';
import { baseURL } from '@/../next.config'; 
import { Loader } from 'lucide-react';
import { TransactionHistory } from '@/types/subscription';
import Transaction from '@/features/user/Transaction';
import Footer from '@/features/landing/components/Footer';
import Header from '@/features/landing/components/Header';

 
export default async function Page({params}:any) {
  const { reference } = await params;  
 
  return (
    <div>
      <Header/>
    <Transaction reference={reference}   />
     
     <Footer/>
    </div> 
  );
}