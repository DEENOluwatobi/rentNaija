import Footer from "@/features/landing/components/Footer";
import Header from "@/features/landing/components/Header";
import Subscribe from "@/features/landing/components/sections/Subscribe";
import { baseURL } from "@/../next.config";
import { PlansInterface } from "@/types/subscription";


const Page = async()=>{ 
 const response = await fetch(baseURL+'/plans');
 const json = await response.json();
 const data:PlansInterface[] = json.data; 

  return <>
    <div>
      <Header/>
      {data &&<Subscribe plans={data} />}
      <Footer/>
    </div>
   
</>

}

export default Page;