'use client'
import React, { useEffect, useState } from 'react';
import { Tabs, TabsTrigger, TabsContent, TabsList } from '@/components/ui/tabs';
import { Banknote, MapPin, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { 
  Apartment, 
  ApiResponse, 
  FindHomesProps, 
  ApartmentCardProps 
} from '@/types/apartment';
import { AxiosApi } from '@/lib/utils';

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onClick }) => (
  <div 
    className="flex flex-col gap-4 p-2 md:p-4 bg-white shadow-md rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
    onClick={() => onClick(apartment)}
  >
    <div className="flex flex-col gap-2">
      <div className="flex w-full h-[200px] rounded-lg overflow-hidden">
        <img 
          src={apartment?.images && Object.values(apartment?.images)[0]?.preview_url || '/placeholder.jpg'} 
          alt={apartment.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[.9em] mdl:text-[1.2em] font-semibold text-gray-700">{apartment.title}</p>
        <div className="flex items-center gap-2">
          <MapPin className="text-orange-500" size={16} />
          <p className="text-[.7em] mdl:text-[.9em] text-gray-600">{`${apartment.city_code}, ${apartment.country_code}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Banknote className="text-orange-500" size={16} />
          <p className="text-[.7em] mdl:text-[.9em] text-gray-600">{apartment.amount}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-orange-500" size={16} />
          <p className="text-[.7em] mdl:text-[.9em] text-gray-600">{apartment.duration}</p>
        </div>
      </div>
    </div>
  </div>
);

const FindHomes: React.FC<FindHomesProps> = ({ initialData }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

    const fetchApartments = async () => {
  
        setIsLoading(true);
        await AxiosApi().get('/api/apartments')

        .then((response)=>{
          let data:ApiResponse = response.data;
        if (data.success) {
          setApartments(data.data.data);
          const uniqueCategories = [...new Set(data.data.data.map((apt:any) => apt.category))];
          setCategories(uniqueCategories);
        } else {
          setError(data.message || 'Failed to fetch apartments');
        }
        }).catch((error) =>setError('Failed to fetch apartments') )
        . finally (()=>{
        setIsLoading(false);
      })
    }

  useEffect(() => {
    if (initialData) {
      setApartments(initialData.data.data);
      const uniqueCategories = [...new Set(initialData.data.data.map(apt => apt.category))]
                    .filter((category): category is string => category !== undefined);
                    setCategories(uniqueCategories);
      return;
    }

    
    fetchApartments();
  }, [initialData]);

  const handleApartmentClick = (apartment: Apartment) => { 
    router.push(`/find-homes/${apartment.id}`);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading apartments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-20 md:py-32 flex flex-col gap-2 md:gap-4 items-center justify-center bg-gray-100 overflow-hidden">
      <p className="text-gray-700 text-[1.3em] text-center md:text-start md:text-[2em] font-semibold">
        Find Your New Home
      </p>

      <Tabs defaultValue="all" className="w-full py-3 md:py-5 flex flex-col gap-8">
        <TabsList className="w-full flex gap-4">
          <div className="w-[1000px] py-4 mx-auto flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar md:justify-center">
            <TabsTrigger value="all" className="p-2 flex gap-2 shadow-md">
              All Properties
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="p-2 flex gap-2 shadow-md">
                {category}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>

        <TabsContent value="all">
          <div className="w-full grid grid-cols-1 sml:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {apartments.map((apt) => (
              <ApartmentCard 
                key={apt.id} 
                apartment={apt} 
                onClick={handleApartmentClick} 
              />
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
            <TabsContent key={category} value={category}>
                <div className="w-full grid grid-cols-1 sml:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {apartments
                        .filter((apt) => apt.category === category)
                        .map((apt) => (
                        <ApartmentCard 
                            key={apt.id} 
                            apartment={apt} 
                            onClick={handleApartmentClick} 
                        />
                    ))}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FindHomes;
