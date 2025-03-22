'use client'
import React, {useEffect, useState} from 'react';
import {Tabs, TabsTrigger, TabsContent, TabsList} from '@/components/ui/tabs';
import {Banknote, MapPin, Clock, Search, Pencil, ChevronLeft, ChevronRight, Loader2} from 'lucide-react';
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
import {baseURL} from "@/../next.config";
import {getUserSubscriptions} from "@/features/landing/api/subscriptions";
import { SubscriptionInterface, TransactionHistory } from '@/types/subscription';
import { AxiosApi, formatAmountNumber, simpleDateFormat } from '@/lib/utils';
import PendingInvoice from './PendingInvoice';


const UserSubscription = () => {

    const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn); 
      
    const [subscriptions, setSubscriptions] = useState<SubscriptionInterface[] | any>()
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    // get all transactions

    // allow viewing and downloading invoice


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };


    const fetchSubscriptions = async () => {
        try {
            if(loading) return;
            setLoading(true);
            const response = await getUserSubscriptions(currentPage, searchTerm);

            if (response.success && response.data) {
                setSubscriptions(response.data.data);
                setTotalPages(Math.ceil(response.data.total / 20));
            } else {
                throw new Error('Invalid response format');
            }

            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to fetch subscriptions');
            setSubscriptions('');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (!isLoggedIn) {
            return redirect( '/auth/login');
        } 
        fetchSubscriptions();
    }, [isLoggedIn])


    
    
    return <div className={"min-h-screen mt-20"}>
        <div className={"px-3 md:px-5"}>
            <h3 className={"sm:text-lg font-bold"}>Subscription History</h3>
            
            <PendingInvoice/>
            <div className={"mt-5"}>
                <div className="p-6">
                    <div className="mb-6">
                        <div className="relative w-2/3 md:w-1/4">
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
                                    <TableHead>Title</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Duration</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="flex justify-center">
                                            <Loader2 className='animate-spin'/> Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : !Array.isArray(subscriptions) || subscriptions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No Subscription Yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subscriptions.map((subscription) => (
                                        <TableRow key={subscription.id}>
                                            <TableCell>
                                                <div className='w-14 h-14 rounded-md overflow-hidden'>
                                                    {subscription.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>{subscription?.name}</TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="link"
                                                        >
                                                            {subscription?.plan?.name}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>{subscription?.plan?.name}</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                {/*<img*/}
                                                                {/*    src={Object.values(apartment.images)[0]?.original_url || '/api/placeholder/400/300'}*/}
                                                                {/*    alt={apartment.title}*/}
                                                                {/*    className="w-full rounded-lg"*/}
                                                                {/*/>*/}
                                                                <div>
                                                                    <h3 className="font-semibold mb-2">Details</h3>
                                                                    <p><strong>Plan:</strong> {subscription?.plan?.name}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Price:</strong> {subscription?.plan?.price}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Duration:</strong> {subscription?.plan?.invoice_interval} {subscription?.plan?.invoice_period}
                                                                    </p>

                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold mb-2">Description</h3>
                                                                <p>{subscription?.plan.description}</p>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                            <TableCell> {subscription?.description} </TableCell>
                                            <TableCell>{simpleDateFormat(subscription?.starts_at)} - {simpleDateFormat(subscription?.ends_at)} </TableCell>

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
                        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
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
        </div>
    </div>
}


export default UserSubscription