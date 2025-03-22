'use client'
import React, { useEffect, useState } from 'react';
import { Banknote, MapPin, Clock, Home, User, Building, Shield, Boxes, List, CreditCardIcon, PhoneCallIcon, Building2Icon, Globe2Icon, MailIcon, BuildingIcon, GlobeIcon, EyeIcon, LucideEye, HeartIcon, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Apartment } from '@/types/apartment';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import ChatDialog from '@/features/landing/components/ChatDialog';
import {backendUrl, baseURL, frontendURL} from "@/../next.config";
import Link from 'next/link';
import { AxiosApi, formatAmountNumber, saveFormData } from '@/lib/utils';
import { EmailIcon, FacebookIcon, FacebookMessengerIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import WhatsAppFloater from '@/app/WhatsappFloater';
import { useAlert } from '@/contexts/AlertContext';

interface ClientProps {
  apartmentId: number; 
}

export default function ApartmentClient({ apartmentId }: ClientProps) {
 
  const router = useRouter(); 
  const { isLoggedIn, token ,isSubscribed} = useSelector((state: any) => state.user); 
  const { showAlert } = useAlert();
 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [likedApartment,setLikedApartment] = useState(false);

  const [apartment ,setApartment ] = useState<Apartment>();


  const fetchApartment = async()=>{
    if(isLoading) return;
    setIsLoading(true);
     await AxiosApi().get(baseURL+'/apartment/'+apartmentId)
     .then((response:{data:any})=>{ 
      const fetched = response?.data.data;
        setApartment(fetched);
        setLikedApartment(fetched?.like_apartment??false);  
    }).finally(()=>setIsLoading(false));
  }

  const toggleLike = async ()=>{
      const newState = !likedApartment;
        setLikedApartment(()=>newState);
       
      if(newState){
        const res = apartment?.like_count??0+1;
       setApartment(apartment=>({ ...apartment, like_count:res }));
        await  AxiosApi().post(baseURL+'/apartment/'+apartmentId+'/like')
        .then(res=>{
          const fetched = res.data?.data;
          if(fetched){ 
            setApartment(fetched);
            setLikedApartment(fetched.like_apartment);
          }
        })
        .catch((error: any)=> showAlert(
          error?.response?.data?.message||  error.message || "Unable to Process, Please try again.",
            "error"
        ))
      }else{
        const res =apartment?.like_count??1-1;

        setApartment(apartment=>({...apartment, like_count:res }));
        await  AxiosApi().post(baseURL+'/apartment/'+apartmentId+'/unlike')
        .then(res=>{ 
          const fetched = res.data?.data;
          if(fetched){ 
            setApartment(fetched);
            setLikedApartment(fetched.like_apartment);
          }
        })
        .catch((error: any)=> showAlert(
          error?.response?.data?.message||  error.message || "Unable to Process, Please try again.",
            "error"
        ))
      }
  }


    useEffect(()=>{
        fetchApartment();
        return ()=>{}
    },[apartmentId]);


  const [bookingData, setBookingData] = useState({
    start: '',
    end: '',
  });
  const [isBooking, setIsBooking] = useState(false);
 


  const calculateEndDate = (startDate: string, duration?: string): string => {
    const start = new Date(startDate);
    const durationMatch = duration?.match(/(\d+)\s*(Year|Month|Week|Day)s?/i);
    
    if (!durationMatch) return startDate; 
    
    const [_, amount, unit] = durationMatch;
    const numAmount = parseInt(amount);
    
    switch(unit.toLowerCase()) {
      case 'year':
        start.setFullYear(start.getFullYear() + numAmount);
        break;
      case 'month':
        start.setMonth(start.getMonth() + numAmount);
        break;
      case 'week':
        start.setDate(start.getDate() + (numAmount * 7));
        break;
      case 'day':
        start.setDate(start.getDate() + numAmount);
        break;
    }
    
    return start.toISOString().split('T')[0];
  };
  
  
  const handleBooking = async () => {
    if (!apartment) return;
    
    if (!isLoggedIn || !token) {
      alert('Please log in to book a viewing session');
      return;
    }
  
    if (!bookingData.start) {
      alert('Please select a start date');
      return;
    }
    
    setIsBooking(true);
    try {
      const formattedStart = bookingData?.start?.split('T')[0];
      const formattedEnd = calculateEndDate(formattedStart, apartment?.duration);
  
      const deposit = Number(apartment?.security_deposit && parseInt(apartment?.security_deposit.replace(/[^0-9]/g, '')));
      const bookingPayload = {
        apartment_id: apartment.id,
        amount: Number(apartment?.amount? apartment?.amount?.replace(/[^0-9]/g, ''):0) + deposit,
        currency_code: "NGN",
        start: formattedStart,
        end: formattedEnd
      };
  
      //console.log('Sending booking payload:', bookingPayload); 
  
      const response = await fetch(baseURL+'/rented-apartment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('Viewing Session Booked successfully!');
        setBookingData({ start: '', end: '' });
        router.push(frontendURL+'/user/rent/'+data.data.id);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to book viewing session. Please try again.');
      }
    } catch (error) {
      //console.error('Error booking viewing session:', error);
      alert('Failed to book viewing session. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!apartment) {
    return <div className="flex justify-center items-center min-h-screen">Apartment not found</div>;
  } 

  return (
    <div className="w-full px-4 py-20 md:py-28">
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


              {/* {
                  
                    apartment.security_deposit &&
                    <div className="flex items-center gap-2">
                    <CreditCardIcon className="text-orange-500"/>
                    <span className="text-gray-600">Security Deposit: {formatAmountNumber(apartment.security_deposit) || 'Not specified'}</span>
                  </div>
              } */}
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
                <span className="text-gray-600 font-bold">Price: {apartment.amount}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="text-orange-500"/>
                <span className="text-gray-600">Duration: {apartment.duration}</span>
              </div>


              <div className="flex items-center gap-2">
                <Shield className="text-orange-500"/>
                <span className="text-gray-800 font-bold">Security Deposit: {apartment?.security_deposit_currency_code}
                {formatAmountNumber(apartment?.security_deposit)  }</span>
              </div>

              <div className="flex items-center gap-2">
                <List className="text-orange-500"/>
                <span
                    className="text-gray-600">Amenities: {apartment.amenities?.length ? apartment.amenities.join(', ') : 'None listed'}</span>
              </div>
                
              {
                apartment?.agent_type=='agent'?<>
                {
                  apartment.agent && <div className="flex items-center gap-2">
                    <User className="text-orange-500"/>
                    <span className="text-gray-600">{String(apartment.agent_type).toLocaleUpperCase()}: {apartment.agent}</span>
                  </div>
              }
              {
               isSubscribed && apartment?.agent_email && <div className="flex items-center gap-2">
                <MailIcon className="text-orange-500"/>
                <span className="text-gray-600">Email: {apartment?.agent_email}</span>
              </div>
              }
{
                 isSubscribed && apartment?.agent_phone && <div className="flex items-center gap-2">
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
                <span className="text-gray-600">{String(apartment.agent_type).toLocaleUpperCase()}: {apartment?.business_name}</span>
              </div>
              } 
                </div>
                { 
               isSubscribed &&   apartment?.business_address && <div className="flex items-center gap-2">
                <GlobeIcon className="text-orange-500"/>
                <span className="text-gray-600">Phone: {apartment?.business_address}</span>
              </div>
              }
                
              {
                 isSubscribed && apartment?.business_email && <div className="flex items-center gap-2">
                <EmailIcon className="text-orange-500"/>
                <span className="text-gray-600">Phone: {apartment?.business_email}</span>
              </div>
              }
              {
                 isSubscribed && apartment?.business_phone && <div className="flex items-center gap-2">
                <PhoneCallIcon className="text-orange-500"/>
                <span className="text-gray-600">Phone: {apartment?.business_phone}</span>
              </div>
              }
                </>
              }
             

             
              <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {

                  isLoggedIn ? isSubscribed === true ? <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                              Book Apartment
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Book Apartment</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">

                              <div className="grid gap-2">
                                <label htmlFor="start-date" className="text-sm font-medium">
                                  Start Date
                                </label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={bookingData.start}
                                    onChange={(e) => setBookingData(prev => ({...prev, start: e.target.value}))}
                                    className="col-span-3"
                                />
                              </div>

                              <div className="bg-orange-50 p-3 rounded-md mt-2">
                                <p className="text-sm text-orange-800">
                                  The booking duration will be {apartment.duration} from the selected start date.
                                </p>
                              </div>

                              <Button
                                  onClick={handleBooking}
                                  disabled={isBooking || !bookingData.start}
                                  className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-2"
                              >
                                {isBooking ? 'Booking...' : 'Confirm Booking'}
                              </Button>

                            </div>

                          </DialogContent>
                        </Dialog>
                        {
                          apartment?.agent_id && (apartment?.agent||apartment?.business_name) &&   <ChatDialog
                            agentId={apartment?.agent_id}
                            agentName={apartment?.agent??apartment?.business_name}
                        />
                        }
                       
                      </> : <div className='col-span-2  py-4 w-full'>
                        <div className='text-xs'>Subscribe now to enjoy the full benefits of our platform</div>
                        <Button onClick={() => router.push('/subscribe')}
                                    className='bg-orange-500 hover:bg-orange-600 text-white w-full mt-2'>Subscribe
                        Now</Button></div>
                      : <div className="text-center col-span-2 py-4 w-full">
                        <p className="text-gray-600 mb-4">
                          Please log in to continue
                        </p>
                        <Button
                            onClick={() => {
                              saveFormData('intended_url', frontendURL+'/find-homes/' + apartment.id);
                              router.push('/auth/login')
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Go to Login
                        </Button>
                      </div>
                }
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{apartment.description}</p>
              </div>
              <div className='flex justify-center space-x-2'>
                <div className='flex space-x-2'>{formatAmountNumber(apartment?.views_count)}<LucideEye/></div>
                <div className='flex justify-center space-x-2'>
                 <div>{apartment?.like_count}</div>
                 <div> <HeartIcon onClick={()=>toggleLike()} className={(likedApartment==true?'text-red-800 fill-red-800':'text-green-800 fill-green-800')+' cursor-pointer'}/>
                </div></div>
                <div className='flex justify-center'>
                  <span className="px-2">Share:</span>
                  <div className="px-2">
                      <FacebookShareButton url={window.location.href}  >
                   <FacebookIcon  size={24}  />
                   </FacebookShareButton >
                  </div>
                  <div className="px-2">
                    <WhatsappShareButton  className="px-2" url={window.location.href}>
                    <WhatsappIcon size={24} className='fill-white bg-white text-green-600'/>
                   </WhatsappShareButton>
                  </div>
              
               

                </div>
              
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Property Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {apartment.images && Object.values(apartment.images).map((image, index) => (
                <div key={index} className="w-full h-[150px] rounded-lg overflow-hidden">
                  <img 
                    src={image.preview_url}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Property Videos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {apartment.videos && Object.values(apartment.videos).map((video, index) => (
                <div key={index} className="relative">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="w-full h-[150px] rounded-lg overflow-hidden bg-gray-100 cursor-pointer flex items-center justify-center">
                        <div className="text-orange-500">Click to play video</div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl flex items-center justify-center p-0 bg-black border-none">
                      <video 
                        controls 
                        className="w-auto h-auto object-cover"
                        src={video.original_url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
