'use client'
import React, {useEffect, useState} from 'react';
import {Tabs, TabsTrigger, TabsContent, TabsList} from '@/components/ui/tabs';
import {Banknote, MapPin, Clock, Search, Pencil, ChevronLeft, ChevronRight} from 'lucide-react';
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
import Link from "next/link";
import {useSelector} from "react-redux";
import {baseURL, frontendURL} from "@/../next.config"; 
import { getUserRents } from '../landing/api/rents'; 
import { RentInterface } from '@/types/rent';
import { formatAmountNumber } from '@/lib/utils' 


const UserRent = () => {
    const router = useRouter();
    //    view previous rents

    // make it easy to upload proof of payment

    // print out
 

    const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn); 
      
    const [rents, setRents] = useState<RentInterface[] | any>()
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    // get all transactions

    // allow viewing and downloading invoice
const handleApartmentClick = (apartment:number) => { 
    router.push(frontendURL+`/find-homes/${apartment}`);
  };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };


    const fetchRents = async () => {
        try {
            if(loading)return ;
            setLoading(true);
            const response = await getUserRents(currentPage, searchTerm);

            if (response.success && response.data) {
                setRents(response.data.data);
                setTotalPages(Math.ceil(response.data.total / 20));
            } else {
                throw new Error('Invalid response format');
            }

            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to fetch subscriptions');
            setRents('');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => { 
        if (!isLoggedIn) {
            return redirect( '/auth/login');
        }
        fetchRents();
    }, [isLoggedIn])


    return <>
        <div

            className="relative bg-gray-100 w-full min-h-screen pt-[64px] md:pt-[75px]"
        >
            <div className="bg-opacity-60 pt-5">
                <div className="w-full px-4 py-8 flex flex-col items-center gap-4 ">
                    <h1 className="text-black/80 text-[1.5rem] font-semibold">Manage Rents</h1>
                </div>


                <div className="mb-6">
                        <div className="relative w-1/3">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search subscriptions..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className=" text-red-800 mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Id</TableHead>
                                    <TableHead>Apartments</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : !Array.isArray(rents) || rents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No Rented Apartment
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rents.map((rent,i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <div className='w-14 h-14 rounded-md overflow-hidden'>
                                                    {rent?.id}
                                                </div>
                                            </TableCell>
                                            <TableCell><button  onClick={()=>handleApartmentClick(rent?.apartment_id)} >{rent?.apartment?.title}</button></TableCell>
                                            <TableCell>{new Date(rent.start).toDateString()} <br/> {new Date(rent?.end).toDateString()}</TableCell>
                                            
                                            <TableCell> {rent?.currency_code}{formatAmountNumber(rent?.amount)} </TableCell>
                                            <TableCell>{rent?.approved==null && rent?.proof_of_payment?'Awaiting Approval':rent?.approved?'Accepted':'Denied'} </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-center space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>
                        <span className="text-sm"> Page {currentPage} of {totalPages} </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4"/>
                        </Button>
                    </div>

            </div>
        </div>
    </>
}


export default UserRent;











