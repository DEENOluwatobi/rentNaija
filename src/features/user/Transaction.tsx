'use client';
import { AxiosApi } from "@/lib/utils";
import { TransactionHistory } from "@/types/subscription";
import { Suspense, useEffect, useState } from "react";
import { baseURL } from "@/../next.config";
import { useAlert } from "@/contexts/AlertContext";
import Invoice from "../subscription/Invoice";
import { CheckCheckIcon, FileIcon, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button"; 
import { DialogHeader } from "@/components/ui/dialog";

interface TransactionI {
    reference: number | string;
}

const Transaction = ({ reference }: TransactionI) => {
    const { showAlert } = useAlert();
    
    const [transaction, setTransaction] = useState<TransactionHistory>();
    const [loading, setLoading] = useState(false);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false); // Prevents multiple uploads

    const fetchTransaction = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await AxiosApi().get(baseURL + `/transaction/invoice/${reference}`);
            setTransaction(res.data.data);
            console.log(res.data.data.payable_type);
        } catch (error: any) {
            showAlert(
                error?.response?.data?.message || error.message || "Unable to Process, Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, [reference]);

    // Handle File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (uploading) return; // Prevent selecting new file while uploading
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0]);
        }
    };

    // Handle File Upload
    const submitProofOfPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!proofFile) {
            showAlert("Please select a file before submitting.", "warning");
            return;
        }
        if (uploading) return; // Prevent re-submitting
        setUploading(true);

        const formData = new FormData();
        if(transaction?.payable_id){
             formData.append('transfer_id',String(transaction.payable_id));
        }
       
        formData.append("proof_of_payment", proofFile);

        try {
            const response = await AxiosApi().post(baseURL + `/bank/upload/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if(response.data.original.errors){
                return showAlert(response.data.original.errors || "Proof uploaded was not successful!", "error");
            }
            showAlert(response.data.message || "Proof uploaded successfully!", "success");
            setProofFile(null);
            fetchTransaction(); // Refresh transaction data after upload
        } catch (error: any) {
            showAlert(error?.response?.data?.message || "Upload failed!", "error");
        } finally {
            setUploading(false);
        }
    };

    const proofOfPayment =()=>{
        return <div className="bg-red-200 py-3 px-2 m-3 rounded">
        <div className="flex flex-col space-y-4">
            <label className="font-bold">
                {transaction?.payable?.proof_of_payment 
                    ? "Proof of Payment Uploaded - Awaiting Review"
                    : "Proof of Payment is Required for Transaction Confirmation"}
            </label>
            <div>
                
            {!transaction?.payable?.proof_of_payment && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="px-2 py-1 text-xs font-bold hover:bg-gray-300 bg-gray-200 rounded">
                            Upload Now
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle className="p-3">
                                <strong>#{transaction?.reference}</strong> Proof Of Payment
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                            <form className="flex flex-col space-y-4" onSubmit={submitProofOfPayment}>
                                <div className="p-2">
                                    <label className="cursor-pointer border p-2 rounded bg-gray-100 hover:bg-gray-200 flex space-x-2" htmlFor="proof">
                                       <FileIcon/>  Upload File {proofFile && <CheckCheckIcon className="text-green-400" />}
                                    </label>
                                    <input type="file" id="proof" hidden name="proof_of_payment" onChange={handleFileChange} disabled={uploading} />
                                </div>
                                <div> 
                                    <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white" disabled={uploading}>
                                        {uploading ? "Uploading..." : "Submit"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            </div>
        </div>
    </div>
    } 
    return (
        <div className="relative min-h-screen pt-28">
            <h2 className="text-center text-2xl font-bold">Transaction Invoice</h2>
            <div className="mb-9">
                {transaction?.payable_type=='App\\Models\\BankTransfer' && transaction.status !== "completed" && proofOfPayment()  }
            </div>
            <div className="p-3">
                <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin" />&nbsp;Loading...</div>}>
                    {transaction && <Invoice transaction={transaction} />}
                </Suspense>
            </div>
        </div>
    );
};

export default Transaction;
