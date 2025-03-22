import { Suspense } from 'react';
import ApartmentClient from '@/features/landing/components/ApartmentClient';
import { baseURL } from '@/../next.config';
import { Apartment } from '@/types/apartment'; 
import { Loader, Loader2Icon } from 'lucide-react';
import { AxiosApi } from '@/lib/utils';

 
export default async function Page({params}:any) {
  const { id } = await params;  

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
      <Loader2Icon className="animate-spin"/>&nbsp;Loading...</div>}>
      <ApartmentClient apartmentId={id}   />
    </Suspense>
  );
}