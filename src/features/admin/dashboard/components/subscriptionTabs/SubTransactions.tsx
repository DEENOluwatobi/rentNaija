"use client"
import { useState, useEffect } from "react"; 
import { TransactionHistory } from "@/types/subscription";
import { useAlert } from "@/contexts/AlertContext";
import { AxiosApi, formatAmountNumber } from "@/lib/utils"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { backendUrl, baseURL } from "@/../next.config"; 
import { Loader2, Loader2Icon, PencilIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 
interface PaginationData{
    current_page: number,
            last_page: number,
            per_page: number,
            total: number,
         data: TransactionHistory[]
}

export interface ApiResponse {
    success: boolean;
    data:PaginationData;
    message: string; 
}

const SubTransactions = () => {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
    const [selectedTransaction,setSelectedTransaction] = useState<TransactionHistory>();

        const fetchTransactions = async () => {
            if(loading) return;
            setLoading(()=>true);
            try {
                const response = await AxiosApi('admin').get<ApiResponse>(baseURL+"/admin/transactions");
                setTransactions(response.data.data.data); // Ensure backend returns the expected data
            } catch (error:any) {
                showAlert(
                    error?.response?.data?.message||  error.message || "Unable to Process, Please try again.",
                      "error"
                )
            } finally {
                setLoading(()=>false);
            }
        };

    useEffect(() => {
        fetchTransactions();
    }, []);


    const selectTransaction = (id:number)=>{
            if(transactions){
                const res =transactions.filter((trans:TransactionHistory)=>trans.id ==id);
                if(res){
                    setSelectedTransaction(res[0]);
                }
            }    
    }


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div>
                
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>
            {
                selectedTransaction?
                <AdminTransaction closeSelected={()=>{setSelectedTransaction(undefined);fetchTransactions()}} transaction={selectedTransaction} />
                :
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Proof Uploaded</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {loading ? (
                            <TableRow>
                                 <TableCell colSpan={7} className="text-center">
                                    <div className='flex justify-center '>
                                        <Loader2 className='animate-spin'/> Loading...
                                    </div>
                                     </TableCell>
                            </TableRow>
                        ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    No Transactions found
                                </TableCell>
                            </TableRow>
                        ) : ( transactions && transactions.map((transaction) => (
                                <TableRow key={transaction.id}> 
                                    <TableCell>{transaction.reference}</TableCell>
                                   <TableCell> {transaction?.payable?.meta?.name} </TableCell>
                                    <TableCell> {transaction?.payable?.plan?.name??transaction?.payable?.name}
<p className="text-xs">({`${transaction?.payable?.plan?.invoice_period}, ${transaction?.payable?.plan?.invoice_interval}`})</p>

                                    </TableCell>
                                    <TableCell>{transaction?.currency} {formatAmountNumber(transaction?.amount)} </TableCell>
                                    <TableCell>{transaction?.payable?.proof_of_payment?'Yes':'No'}</TableCell>
                                    <TableCell>{transaction?.payable?.status} </TableCell>
                                    <TableCell className={'flex '}>
                                        <Button variant={"secondary"} className={"mt-1"} onClick={()=>selectTransaction(transaction.id)} >
                                            <PencilIcon />
                                        </Button>
                                       {/*  <Button
                                            variant="destructive"
                                            size="sm"
                                            className='bg-red-500 text-white px-4 py-1 mx-3 rounded-md'
                                            onClick={() => handleDelete(transaction.id)}
                                        >
                                            Delete
                                        </Button>
                                        {
                                             !transaction.published ? <Button
                                                variant="outline"
                                                size="sm"
                                                className='bg-green-500 text-white px-4 py-1 mx-3 rounded-md'
                                                onClick={() => handlePublish(transaction.id, true)}
                                            >
                                                Publish
                                            </Button> : <Button
                                                variant="outline"
                                                size="sm"
                                                className='bg-red-500 text-white px-4 py-1 mx-3 rounded-md'
                                                onClick={() => handlePublish(transaction.id, false)}
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
            }
            </div> 
        </div>
    );
};

export default SubTransactions;
// transactions.map((transaction) => (
//                     
//                 ))


const AdminTransaction = ({ transaction,closeSelected }: { transaction: TransactionHistory,closeSelected?:any }) => {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(transaction?.payable?.status);

    const updateTransactionStatus = async (newStatus: string) => {
        setLoading(true);
        try {
            await AxiosApi('admin').post(baseURL+`/transaction/verify`, { user_id:transaction.user_id,reference:transaction.reference, plan_id:transaction.payable.plan_id,status: newStatus });
            setStatus(newStatus);
            showAlert(`Transaction ${newStatus} successfully!`, "success");
        } catch (error) {
            showAlert("Failed to update transaction status.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow bg-white">
            <h2 className="text-lg font-bold">Transaction #{transaction.reference}</h2>
            <p><strong>Plan:</strong> {transaction?.payable?.plan?.name??transaction?.payable?.name}</p>
            <p><strong>Amount:</strong> {transaction.currency} {formatAmountNumber(transaction.amount)}</p>
            <p><strong>Status:</strong> <span className={`text-${status === "verified" ? "green" : "red"}-600`}>{status}</span></p>
            <p><strong>User:</strong> {transaction.payable?.meta.name} ({transaction.payable?.meta.email })</p>
            <p>Duration: {`${transaction?.payable?.plan?.invoice_period}, ${transaction?.payable?.plan?.invoice_interval}`}</p>
            {transaction && transaction.payable?.proof_of_payment && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="mt-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">View Proof</button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Proof of Payment</DialogTitle>
                        </DialogHeader>
                        <img src={transaction.payable?.proof_url} alt="Proof of Payment" className="w-full" />
                    </DialogContent>
                </Dialog>
            )}
            <div className="  flex space-x-2 mt-10">
                <Button onClick={() => updateTransactionStatus("confirmed")} disabled={loading || status === "confirmed"} className="bg-green-500 hover:bg-green-600 text-white">Confirm</Button>
                <Button onClick={() => updateTransactionStatus("denied")} disabled={loading || status === "denied"} className="bg-red-500 hover:bg-red-600 text-white">Decline</Button>
            </div>
            <div>
                <p className="text-gray-400 text-xs">Please note that unpaid invoices expire under 48hours</p>
            </div>
            <div className="mt-20">
                <Button variant={"destructive"} onClick={()=>closeSelected()}>Back</Button>
            </div>
        </div>
    );
};
