import ApartmentClient from "@/features/landing/components/ApartmentClient";
import BookApartment from "@/features/user/BookApartment";
import { Loader } from "lucide-react";
import { Suspense } from "react";



 async function Page({params}:any) {
  const { id } = await params;  

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin"/>&nbsp;Loading...</div>}>
      <BookApartment bookingId={id}   />
    </Suspense>
  );
}

export default Page;