import ManageRent from '@/features/agent/dashboard/components/ManageRent';
import { Loader2Icon } from 'lucide-react';
import React, { Suspense } from 'react';  

const page = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
         <Loader2Icon className="animate-spin"/>&nbsp;Loading...</div>}>
        <ManageRent/>
      </Suspense>
  )
}

export default page