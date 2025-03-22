import { PlansInterface } from "@/types/subscription";



interface PaystackI{
    plan?:PlansInterface,
    onCompleted?:any,
    onGoBack: () => void
}

const Paystack = ({plan,onCompleted}:PaystackI)=>{


  return  <div>
    <h3>Paystack Transfer</h3>
    <div>
        <p> 
        <label>
            Plan {plan?.name}
        </label>
        </p>



    </div>
</div>
}


export default Paystack;