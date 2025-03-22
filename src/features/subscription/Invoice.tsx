import { bankInterface, TransactionHistory } from "@/types/subscription";
import React from "react";
import {useReactToPrint} from "react-to-print";
import {FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton} from "react-share";
import { MutableRefObject, useRef } from "react";  
import { extractClassName, formatAmountNumber, formatDate, setColor, simpleDateFormat } from "@/lib/utils"; 
import Link from "next/link";
import Image from 'next/image';
import Logo from '@/components/assets/logo/logo.png'



interface InoviceI {
    transaction:TransactionHistory
}

const Invoice = ({transaction}:InoviceI)=> {
 
    const componentRef = useRef<HTMLDivElement>(null);
    // Function to download PDF
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Transaction_Receipt_${transaction?.reference}`
    });


    return (
        <div className={"flex justify-center pt-2 items-start bg-gray-100 min-h-[600px]"}>
            <div className="p-2 max-w-md mx-auto bg-white shadow-lg rounded-lg ">
                <Layout transaction={transaction} ref={componentRef}/>

                <div className="flex justify-between mt-6">
                    <button className={"  px-2 py-1 m-0 hover:shadow-lg"} onClick={() => handlePrint()}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             fill="#000000" width="24" height="24" viewBox="0 0 512 512" data-name="Layer 1"
                             id="Layer_1">
                            <path
                                d="M256,409.7,152.05,305.75,173.5,284.3l67.33,67.32V34h30.34V351.62L338.5,284.3,360,305.75ZM445.92,351v93.22a3.61,3.61,0,0,1-3.47,3.48H69.15a3.3,3.3,0,0,1-3.07-3.48V351H35.74v93.22A33.66,33.66,0,0,0,69.15,478h373.3a33.85,33.85,0,0,0,33.81-33.82V351Z"/>
                        </svg>
                    </button>

                    <div className="flex space-x-4">
                        <div className="">
                        <FacebookShareButton url={window.location.href}>
                            <FacebookIcon className="rounded" size={24}/>
                        </FacebookShareButton>
                        </div>
                        <div className="">
                        <WhatsappShareButton url={window.location.href}>
                           <WhatsappIcon  className="rounded"    size={24} />
                        </WhatsappShareButton></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Invoice;


const Layout = React.forwardRef<HTMLDivElement, InoviceI>(({transaction}  , ref) => {
     
    const withdrawal = (bank:bankInterface) => { 
       return  <>
                {/*transfer to bank*/}
                <div className={""}>Bank Details</div>
                <div>
                    <div
                        className={" flex flex-col justify-end items-end text-end pr-3  "}>
                             {bank.icon && <img src={bank?.bank_icon} width={60} height={60} alt={bank.bank_name} />}
                    </div>  
                    <div className={"text-end word-break "}>Bank Name: {String(bank?.bank_name) } 
                        </div>  
                    <div className={"text-end "}>
                            Account Name: <div className="text-mono word-break font-semibold"> {String(bank?.account_name) }</div>
                             </div>
                    <div className={" text-end "}>
                      Account Number:  <div className="text-mono  word-break font-semibold">{ bank?.account_number}</div> </div>
                </div>
                <div className={""}>User Details</div>
                <div className={"text-end pr-3"}>
                    <div className={" placeholder:pr-3"}>Account Name: <div className=" word-break text-mono font-semibold">{transaction.payable?.meta?.name}</div></div>
                    <div className={" pr-3"}>Email: <div className="text-mono font-semibold word-break">{transaction.payable?.meta?.email}</div></div>
                </div>
                <div className={""}>Transaction Type</div>
                 
                <div className={"text-end  word-break  pr-3"}>{extractClassName(transaction?.payable_type) }</div>
               
                <div className={""}>Transaction No.</div>
                <div className={"text-end  word-break   pr-3"}>{transaction?.reference}</div>
                <div className={""}></div>
                <div className={"  pr-3"}></div>
            </>
    }

    return <div ref={ref}>
        <div className="p-4 space-x-8 space-y-2 border rounded min-h-[500px]">
            <div className={"flex"}>
                <div className="flex flex-1">
                <Link href="/" className="">
                    <Image src={Logo} alt='logo' width={500} height={500} className='w-[120px] h-[50px] object-contain'/>
                </Link>
                </div>
                <h2 className="text-sm mt-3 text-end pr-3 font-bold uppercase mb-4">Transaction Invoice</h2>
            </div>
            <div className={"mt-4"}>
                <p className={"text-center font-bold "}>
                    <strong
                        className={setColor(transaction?.status) + ' font-bold text-2xl md:text-3xl'}>{ transaction?.currency} {formatAmountNumber(transaction?.amount)}</strong>
                </p>
                <p className={"text-center uppercase font-bold text-gray-500"}>{transaction?.status=='completed'?'success':transaction?.status.toUpperCase()} </p>
                <p className={" text-center flex justify-center"}>
                            <span className={"mx-1"}>
                                <svg className="_6aYwdjzDCvXK0bVJQOb rxe6apEJoEk8r75xaVNG ADSeKHR1DvUUA48Chci_"
                                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                                     height={"14"} width={"14"}>
            <path fillRule="evenodd"
                  d="M6 5V4a1 1 0 1 1 2 0v1h3V4a1 1 0 1 1 2 0v1h3V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v2H3V7c0-1.1.9-2 2-2h1ZM3 19v-8h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6-7H7v2h2v-2Zm2 0h2v2h-2v-2Zm6 0h-2v2h2v-2ZM7 16h2v2H7v-2Zm6 0h-2v2h2v-2Zm2 0h2v2h-2v-2Z"
                  clipRule="evenodd"/> </svg>
                            </span>
                    {simpleDateFormat(transaction?.created_at)}</p>
                <hr className={"my-2"}/>
            </div>
            <div className={"mt-1 grid grid-cols-2 gap-8"}>
                {
                    transaction?.payable?.bank && withdrawal(transaction?.payable?.bank)
                }
            </div>
        </div>
        <hr/>
        <div className={"w-full text-center text-gray-400   mt-3"}>
            If transaction is not successful after 24hours, please contact our customer service  
        </div>
    </div>
}) 
