import AgentProfile from "@/features/landing/components/AgentProfile";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";



 
export default async function Page({params}:any) {
  const { id } = await params;  

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
      <Loader2Icon className="animate-spin"/>&nbsp;Loading...</div>}>
      <AgentProfile agentId={id}   />
    </Suspense>
  );
}