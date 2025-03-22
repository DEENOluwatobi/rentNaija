'use client'
import React, {useEffect, useState} from 'react';
import {Tabs, TabsTrigger, TabsContent, TabsList} from '@/components/ui/tabs';
import {Banknote, MapPin, Clock, Search, Pencil, ChevronLeft, ChevronRight, Loader2, EyeIcon} from 'lucide-react';
import {redirect, useRouter} from 'next/navigation';
import type {
    Apartment,
    ApiResponse,
    FindHomesProps,
    ApartmentCardProps
} from '@/types/apartment';
import {Input} from "@/components/ui/input";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button"; 
import {baseURL} from "@/../next.config"; 
import { SubscriptionInterface, TransactionHistory } from '@/types/subscription';
import { AxiosApi, formatAmountNumber } from '@/lib/utils';
import {useSelector} from "react-redux";
import Link from 'next/link';


const PendingInvoice =()=>{

    const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn); 

    const [loadingPending, setLoadingPending] = useState(false);
    const [pendingSubs,setPendingsubs] = useState<TransactionHistory[]>();
    
    
    
    const checkPendingSubscription =async ()=>{
        if(loadingPending) return ;
        setLoadingPending(true);
    // if exists set the subscription
         await AxiosApi().get(baseURL+'/transaction/unpaid')
            
        .then(response=>{
            // set subscription 
            if(response.data.data){
                setPendingsubs(response.data.data) ;
            }
        
        })
        .finally(()=>setLoadingPending(false));
    }
    


    useEffect(() => { 
        if (!isLoggedIn) {
            return redirect( '/auth/login');
        }
        checkPendingSubscription(); 
    }, [isLoggedIn])



    return  <div className="mt-[20px]">
                            <h2>  Pending Subscriptions</h2>
                            <div className="py-3 px-2">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow> 
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                
                                    <TableBody>
                                        {loadingPending ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">
                                                    <div className='flex justify-center '>
                                                        <Loader2 className='animate-spin'/> Loading...
                                                    </div>
                                                
                                                </TableCell>
                                            </TableRow>
                                        ) : !Array.isArray(pendingSubs) || pendingSubs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">
                                                    No Pending Invoice found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            pendingSubs.map((sub:TransactionHistory) => (
                                                <TableRow key={sub.id}>
                                                     <TableCell>{sub?.reference}</TableCell>
                                                    <TableCell>
                                                         {sub?.payable?.plan?.name??sub?.payable?.name}
                                                    </TableCell>
                                                    <TableCell>{sub?.currency} {formatAmountNumber(sub?.amount)}</TableCell>

                                                    <TableCell>{`${sub?.payable?.plan?.invoice_period}, ${sub?.payable?.plan?.invoice_interval}`}</TableCell>
                                                    <TableCell>{sub?.payable?.status}</TableCell>
                                                      <TableCell className={'flex '}>  
                                                        <Link  className={"mt-1"} href={"/invoice/"+sub?.reference}>
                                                            <EyeIcon />
                                                        </Link>
                                                        {/* <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className='bg-red-500 text-white px-4 py-1 mx-3 rounded-md'
                                                            onClick={() => handleDelete(apartment.id)}
                                                        >
                                                            Delete
                                                        </Button> */}
                                                        {/* {
                                                             !apartment.published ? <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className='bg-green-500 text-white px-4 py-1 mx-3 rounded-md'
                                                                onClick={() => handlePublish(apartment.id, true)}
                                                            >
                                                                Publish
                                                            </Button> : <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className='bg-red-500 text-white px-4 py-1 mx-3 rounded-md'
                                                                onClick={() => handlePublish(apartment.id, false)}
                                                            >
                                                                UnPublish
                                                            </Button>
                                                        } */}
                
                                                    </TableCell>  
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                             </div>
                        </div>
}

export default PendingInvoice;