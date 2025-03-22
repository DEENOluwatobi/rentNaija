"use client"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUserSubscriptions } from "@/features/landing/api/subscriptions";
import { formatAmountNumber, formatDate, simpleDateFormat } from "@/lib/utils";
import { SubscriptionInterface } from "@/types/subscription";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";


const SubSubscriptions = ()=>{ 
      
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
            setLoading(()=>true);
            const response = await getUserSubscriptions(currentPage, searchTerm,'admin');

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
            setLoading(()=>false);
        }
    }; 


    useEffect(()=>{
        fetchSubscriptions();
    },[]);


    return  <div  className="p-6 bg-gray-50 min-h-screen">
            <div>
                
            <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
        <div className="mb-6">
            <div className="relative w-2/3 md:w-2/4">
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
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Cancelled on</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        <TableRow>
                           <TableCell colSpan={5} className="text-center">
                                    <div className='flex justify-center '>
                                        <Loader2 className='animate-spin'/> Loading...
                                    </div>
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
                                <TableCell>{subscription?.subscriber?.name}</TableCell>
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
                                                            <strong>Price:</strong> {subscription?.plan?.currency} {formatAmountNumber(subscription?.plan?.price)}
                                                        </p>
                                                        <p>
                                                            <strong>Duration:</strong> {subscription?.plan?.invoice_interval} {subscription?.plan?.invoice_period}
                                                        </p>

                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-2">Description</h3>
                                                    <p>{subscription?.plan?.description}</p>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <TableCell>{simpleDateFormat(subscription?.starts_at)} - {simpleDateFormat(subscription?.ends_at)} </TableCell>
                                <TableCell> {simpleDateFormat(subscription?.canceled_at)} </TableCell>

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
}

export default SubSubscriptions;