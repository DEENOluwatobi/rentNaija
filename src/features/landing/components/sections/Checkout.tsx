"use client"
import { PlansInterface } from "@/types/subscription";
import BankTransfer from "./BankTransfer";
import { useEffect, useState } from "react";
import { BanknoteIcon, PlayIcon } from "lucide-react";
import Paystack from "./Paystack";
import { BankIcon } from "@/icons";
import { formatAmountNumber } from "@/lib/utils"; 
import { useSelector } from "react-redux"; 
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

interface CheckoutI {
    plans?:PlansInterface[]
}
interface GatewayI{
    title:string,
    slug:string,
    component:any,
    active:boolean,
    icon:any,
    className:string
}


const Checkout = ( {plans}:CheckoutI)=>{
    const router = useRouter();
    const user = useSelector((state: RootState) => state.agent);
    const { isLoggedIn, firstName, lastName } = useSelector((state: RootState) => state.agent);
  
    useEffect(() => {
      if (!isLoggedIn) {
        router.push('/auth/login');
      }
    }, [isLoggedIn, router]);

    // auth required

    const [selectedPlan,setSelectedPlan] = useState<PlansInterface|undefined>();
    const [selectedGateway,setSelectedGateway] = useState<GatewayI>();
    
    const [gatewayResponse,setGatewayResponse] = useState();

 

// payment gateway selection
const gateways:GatewayI[] = [
    {title:'Bank Transfer','slug':'bank-transfer',component:<BankTransfer plan={selectedPlan} onCompleted={setGatewayResponse} />,active:true,icon:<BanknoteIcon />,className:"text-lg font-bold bg-gray-800 text-white rounded hover:shadow-lg"},
    {title:'Paystack','slug':'paystack',component:<Paystack plan={selectedPlan}  onCompleted={setGatewayResponse} />,active:false,icon:<BankIcon  />,className:"text-lg font-bold bg-blue-200 text-black rounded hover:shadow-lg"}

]

const selectedPlanIs = (id:number) =>{

    const set = plans?.filter((r=>r.id==id));

    if(set){
        setSelectedPlan(set[0])
    }
}

const selectedPaymentMethodIs = (slug:string,active:boolean)=>{
    console.log('here',slug,active);
    if(!active){
        return alert('Gateway Not Available');
    }
    const set = gateways?.filter((r=>r.slug==slug));
    if(set){
    setSelectedGateway(set[0])
    }
}

const PlanSelection =()=>{
    return  <div>
        <h3 className="text-2xl font-bold text-center">Subscription Selection</h3>
            <div className="grid grid-cols-2"> {
           plans  &&  Object.keys(plans).length>0 && 
            plans?.map((pl:PlansInterface,index:number)=><div key={index} className="relative text-gray-300" id="pricing">
                <div aria-hidden="true" className="absolute inset-0 h-max w-full m-auto grid grid-cols-2 -space-x-52 opacity-20">
            <div className="blur-[106px] h-56 bg-gradient-to-br to-purple-400 from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-indigo-600"></div>
            </div>
            <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
                <div className="mb-10 space-y-4 px-6 md:px-0">
                    <h2 className="text-center text-2xl font-bold text-white sm:text-3xl md:text-4xl">Pricing</h2>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <div
                    className="flex flex-col items-center aspect-auto p-4 sm:p-8 border rounded-3xl bg-gray-800 border-gray-700 shadow-gray-600/10 shadow-none m-2 flex-1 max-w-md">
                    <h2 className="text-lg sm:text-xl font-medium text-white mb-2">{pl.name}</h2>
                    <p className="text-lg sm:text-xl text-center mb-6 mt-4">
                        <span className="text-3xl sm:text-4xl font-bold text-white">{pl.currency}{formatAmountNumber(pl?.price)}</span>  / {pl?.invoice_interval}
                    </p>
                    <p className="text-center mb-6">{Object.values(pl?.description)}</p>
                    <button className="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-white before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                   ><span className="relative text-sm font-semibold text-black" onClick={()=>{selectedPlanIs(pl.id)}}>Get Started</span></button>
                    </div>
                </div>
            </div>
            </div>)
        }
    </div>
  </div>
}


const SelectPaymentMethod = ()=>{
    
    return <> <div className="p-5 ">
            <h3 className="text-2xl">Payment Method</h3>
            <div className="p-4">
                <label className="mb-9 font-bold text-lg">Plan: {selectedPlan?.name}</label>
                <p><strong> {selectedPlan?.currency}{formatAmountNumber(selectedPlan?.price)} </strong> / {selectedPlan?.invoice_interval}</p>
            </div>
            <div className="p-3 mt-20">
                <div className={"flex flex-wrap space-x-8"}>
                    {
                        gateways.map((way:any,i:number)=><button key={i} className={" py-4 px-3  cursor-pointer "+way.className} 
                        onClick={()=>selectedPaymentMethodIs(way.slug,way.active)} 
                         >
                            <h5 className="text-lg flex space-x-4">{way.icon} {way.title}</h5>
                            <p></p> 
                        </button>)
                    }
                </div>
            </div>
        </div>
    </>
}

return <>
<div className="p-6 flex justify-center items-center min-h-screen">
  {
            (selectedGateway && selectedPlan)?selectedGateway.component:
            <div>
            {selectedPlan?SelectPaymentMethod(): PlanSelection()}
        </div>
        } 
</div>
</>
}



export default Checkout;