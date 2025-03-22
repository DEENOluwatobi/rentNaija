"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import { AxiosApi, formatAmountNumber, saveFormData, simpleDateFormat } from "@/lib/utils";
import { Apartment } from "@/types/apartment";
import {redirect, useRouter} from 'next/navigation';
import { RentInterface } from "@/types/rent";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Banknote, Boxes, Building, BuildingIcon, Calendar1Icon, CheckCheckIcon, Clock, CreditCardIcon, FileIcon, GlobeIcon, Home, LinkIcon, List, MailIcon, MapPin, PhoneCallIcon, ReceiptCentIcon, Shield, ShoppingBag, ShoppingBagIcon, User } from "lucide-react";
import router from "next/router";
import { Input } from "postcss";
import { useEffect, useState } from "react";
import { EmailIcon } from "react-share";
import { baseURL, frontendURL } from "@/../next.config";
import ChatDialog from "../landing/components/ChatDialog";
import { useAlert } from "@/contexts/AlertContext";
import Link from "next/link";
import { useSelector } from "react-redux";


interface BookApartmentI{
    bookingId :number;
}


const BookApartment =({bookingId}:BookApartmentI)=>{

  
      const {isLoggedIn,isSubscribed} = useSelector((state: any) => state.user); 
      
          useEffect(() => { 
              if (!isLoggedIn) {
                  return redirect( '/auth/login');
              } 
          }, [isLoggedIn])
      
        const [isLoading,setIsLoading] = useState(false);
        const { showAlert } = useAlert();
        
    /**
     * apartment interface
     * agent_type?: string;
         agent_id: number;
         agent_phone?:number|string;
         agent_email?:string;
         id: number;
         agent: string;
         my_apartment?: boolean;
         business_name?: string;
         business_address?: string;
         business_email?: string;
         business_logo?: string;
         business_phone?:string|number;
         category_id: string;
         category: string;
         title: string;
         description: string;
         number_of_rooms: string;
         amount: string;
         security_deposit: string;
         duration: string;
         amenities: any[];
         country_code: string;
         state_code: string;
         city_code: string;
         published: string;
         can_rate: string;
         can_advertise: string;
         images: { [key: string]: Image };
         videos: { [key: string]: Video };
         thumbnail: null | string;
         views_count: number;
     */
    const [apartment, setApartment] = useState<Apartment>();
   
   /**
    * rent interface 
    *   id:number,
        tenant_id:number,
        apartment_id:number,
        amount:number,
        currency_code:string|null,
        proof_of_payment?:File|null,
        start?:Date|string|null,
        end?: Date|string|null,
        metadata: any,
        approved?:boolean,
        created_at:Date|string,
        updated_at:Date|string
        apartment?:Apartment
    */
    const [rent,setRent] = useState<RentInterface>();
 
    const fetchRent = async()=>{
        if(isLoading) return;
        setIsLoading(true);
         await AxiosApi().get (baseURL+'/rented-apartment/'+bookingId)
         .then((response:{data:any})=>{  
            setRent(()=>response?.data.data);  
            if(response.data.data.apartment){
                setApartment(response.data.data.apartment)
            }
        })
        .catch ((error: any)=> {
            showAlert(
                error?.response?.data?.message || error.message || "Unable to Process, Please try again.",
                "error"
            );
        }) 
        .finally(()=>setIsLoading(false));
      }
 

  useEffect(()=>{
    fetchRent();
 
    return ()=>{}
},[bookingId]);
 


    //show page loading using lucide react icon, get the booked apartment

    // provide an invoice template

    // request proof of payment for apartment
    const [proofFile, setProofFile] = useState<File | null>(null);
    
    const [uploading, setUploading] = useState(false); // Prevents multiple uploads


    // inform of apartment rent notification sent to the agent please wait


    // when the apartment is booked, this page should not be made availble but redirect to user/rent
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
    if(rent){
        
    if (uploading) return; // Prevent re-submitting
    setUploading(true);

    const formData = new FormData();
    formData.append('booking_id',String(bookingId));
    formData.append('user_id',String(rent?.tenant_id));

    formData.append("proof_of_payment", proofFile);

     await AxiosApi()
        .post(baseURL + `/rented-apartment/${bookingId}/proof`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response:any)=>{
         
        if(response.data.original.errors){
            return showAlert(response.data.original.errors || "Proof uploaded was not successful!", "error");
        }
        showAlert(response.data.message || "Proof uploaded successfully!", "success");
        setProofFile(null);
        fetchRent() // Refresh Rent data after upload
        })
        .catch ((error: any)=>{
        showAlert(error?.response?.data?.message || "Upload failed!", "error");
    }). finally (()=>{
        setUploading(false);
    })
    }
};

const proofOfPayment =()=>{
    return <div className=" ">
    <div className="flex flex-col space-y-4">
        <label className="font-bold flex ">
        <ShoppingBagIcon className="text-orange-500"/>&nbsp; {rent && rent.proof_of_payment 
                ? "Proof of Payment Uploaded - Awaiting Verification"
                : "Proof of Payment is Required for Transaction Confirmation"}
        </label>
        <div>
            
        {rent && !rent.proof_of_payment && (
            <Dialog>
                <DialogTrigger asChild>
                    <button className="px-2 py-1 text-xs font-bold hover:bg-gray-300 bg-gray-200 rounded">
                        Upload Now
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader>
                        <DialogTitle className="p-3">
                            <strong> {rent?.apartment?.title} Proof Of Payment</strong> 
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

return<>
<main className="mt-[83px] p-4 min-h-screen"> 
    <h3 className="font-bold text-2xl">Rental Service</h3>
    <div className="flex flex-col min-h-[150px]">
        {/* //  rent information then */}

        {
            rent && <div className="space-y-3"> 
        
            <div className="flex items-center gap-2">
                <CreditCardIcon className="text-orange-500"/>
                <span className="text-gray-600">Cost: <strong> {rent?.currency_code}{formatAmountNumber(rent?.amount)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar1Icon className="text-orange-500"/>
                <span className="text-gray-600">Duration: <strong>{simpleDateFormat(rent?.start)} - {simpleDateFormat(rent?.end)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
                
                <span className="text-gray-600">  {proofOfPayment()}</span>
            </div>
        
            <div className="font-semibold text-xs text-red-500 text-justify">
                  Please contact the agent directly through the agent details provided and get the account to make payment to. then upload your proof of payment here for verification and documentation.  
            </div>
            <div className="flex space-x-2">
               To View Rent History: <Link href={"/user/rent"} className="font-bold flex space-x-2" ><LinkIcon /> Click Here</Link>
                </div>
        </div>
       
        }
    </div>
    <div>
    {apartment && 
    <Card className="w-full md:w-[90%] mx-auto border-none">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <img 
                src={apartment.images && Object.values(apartment.images)[0]?.preview_url || '/placeholder.jpg'}
                alt={apartment.title}
                // width={500}
                // height={500}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold text-gray-800">{apartment.title}</h1>

              <div className="flex items-center gap-2">
                <Home className="text-orange-500"/>
                <span className="text-gray-600">Rooms: {apartment.number_of_rooms}</span>
              </div>


              {
                  
                    apartment.security_deposit &&
                    <div className="flex items-center gap-2">
                    <CreditCardIcon className="text-orange-500"/>
                    <span className="text-gray-600">Security Deposit: {formatAmountNumber(apartment.security_deposit) || 'Not specified'}</span>
                  </div>
              }
              {
                  apartment.business_name &&
                  <div className="flex items-center gap-2">
                    <Building className="text-orange-500"/>
                    <span className="text-gray-600">Business: {apartment.business_name || 'Not specified'}</span>
                  </div>
              }

              {
                  apartment.category && <div className="flex items-center gap-2">
                    <Boxes className="text-orange-500"/>
                    <span className="text-gray-600">Category: {apartment.category}</span>
                  </div>
              }


              <div className="flex items-center gap-2">
                <MapPin className="text-orange-500"/>
                <span
                    className="text-gray-600">{`${apartment.city_code}, ${apartment.state_code}, ${apartment.country_code}`}</span>
              </div>

              <div className="flex items-center gap-2">
                <Banknote className="text-orange-500"/>
                <span className="text-gray-600">Price: {apartment.amount}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="text-orange-500"/>
                <span className="text-gray-600">Duration: {apartment.duration}</span>
              </div>


              <div className="flex items-center gap-2">
                <Shield className="text-orange-500"/>
                <span className="text-gray-600">Security Deposit: {apartment.security_deposit || 'None'}</span>
              </div>

              <div className="flex items-center gap-2">
                <List className="text-orange-500"/>
                <span
                    className="text-gray-600">Amenities: {apartment.amenities?.length ? apartment.amenities.join(', ') : 'None listed'}</span>
              </div>
 {
                  apartment.agent && <div className="flex items-center gap-2">
                    <User className="text-orange-500"/>
                    <span className="text-gray-600">{String(apartment.agent_type).toLocaleUpperCase()}: {apartment.agent}</span>
                  </div>
              }
              {
                apartment?.agent_type=='agent'?<>
              {
                apartment?.agent_email && <div className="flex items-center gap-2">
                <MailIcon className="text-orange-500"/>
                <span className="text-gray-600">Email: {apartment?.agent_email}</span>
              </div>
              }
{
                apartment?.agent_phone && <div className="flex items-center gap-2">
                <PhoneCallIcon className="text-orange-500"/>
                <span className="text-gray-600">Phone: {apartment?.agent_phone}</span>
              </div>
              }          
                </>:<>
                <div className='flex justify-start space-x-2'>
                {
                apartment?.business_logo && <div className="flex items-center gap-2"> 
                <img src={apartment?.business_logo} className='w-32 rounded-lg hover:shadow-lg' />
                 </div>
              }{
                apartment?.business_name && <div className="flex items-center gap-2">
                <BuildingIcon className="text-orange-500"/>
                <span className="text-gray-600">Email: {apartment?.business_name}</span>
              </div>
              }
                </div>
                
{
                apartment?.business_address && <div className="flex items-center gap-2">
                <GlobeIcon className="text-orange-500"/>
                <span className="text-gray-600">Phone: {apartment?.business_address}</span>
              </div>
              }
                
{
                apartment?.business_email && <div className="flex items-center gap-2">
                <EmailIcon className="text-orange-500"/>
                <span className="text-gray-600">Phone: {apartment?.business_email}</span>
              </div>
              }
              {
                apartment?.business_phone && <div className="flex items-center gap-2">
                <PhoneCallIcon className="text-orange-500"/>
                <span className="text-gray-600">Phone: {apartment?.business_phone}</span>
              </div>
              }
                </>
              }  
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{apartment.description}</p>
              </div>
            </div>
          </div> 
        </CardContent>
      </Card>
    }
    </div>

</main>
</>
}

export default BookApartment;