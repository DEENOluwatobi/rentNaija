'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Banknote, Bed, Home, MapPin, Scaling } from 'lucide-react';
import type { Apartment, ApiResponse } from '@/types/apartment';
import Maps from './Maps';

const PointContact = () => {
    const [displayedApartments, setDisplayedApartments] = useState<Apartment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAndProcessApartments = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/apartments');
                const data: ApiResponse = await response.json();

                if (data.success && data.data.data) {
                    const apartments = data.data.data;
                    const categories = [...new Set(apartments.map(apt => apt.category))];
                    
                    const selected = categories.slice(0, 5).map(category => {
                        const categoryApartments = apartments.filter(apt => apt.category === category);
                        const randomIndex = Math.floor(Math.random() * categoryApartments.length);
                        return categoryApartments[randomIndex];
                    });

                    while (selected.length < 5 && apartments.length >= 5) {
                        const randomIndex = Math.floor(Math.random() * apartments.length);
                        const apartment = apartments[randomIndex];
                        if (!selected.find(apt => apt.id === apartment.id)) {
                            selected.push(apartment);
                        }
                    }

                    setDisplayedApartments(selected);
                } else {
                    setError(data.message || 'Failed to fetch apartments');
                }
            } catch (error) {
                setError('Failed to fetch apartments');
                //console.error('Error fetching apartments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndProcessApartments();
    }, []);

    const handleApartmentClick = (apartment: Apartment) => {
        const encodedData = encodeURIComponent(JSON.stringify(apartment));
        router.push(`/find-homes/${apartment.id}`);
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-[500px] flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-[500px] flex items-center justify-center bg-gray-100">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className='px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-center bg-gray-100'>
            <div className='w-full overflow-hidden flex flex-col items-center md:items-start lg:px-2'>
                <h1 className='text-[.7em] md:text-[.8em] font-bold text-orange-500'>YOUR REAL ESTATE PARTNER</h1>

                <p className='text-gray-700 text-[1.3em] text-center md:text-start md:text-[1.8em] font-semibold'>
                    A Single Point Of Contact For All Of Your Real Estate Needs.
                </p>
                
                <p className='text-gray-700 text-[.7em] md:text-[.8em] text-center md:text-start'>
                    Explore homes crafted for your comfort and style, with modern 
                    interiors and prime locations. Each property is designed to meet 
                    your needs, offering convenience, elegance, and community at its best.
                </p>

                <div className='mt-4 w-full flex flex-col gap-2'>
                    {displayedApartments.map((apartment, index) => (
                        <div 
                            key={apartment.id} 
                            className='w-full h-[100px] sm:h-[120px] bg-white p-2 md:p-4 rounded-xl md:rounded-2xl overflow-hidden shadow-md flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow'
                            onClick={() => handleApartmentClick(apartment)}
                        >
                            <div className='w-[30%] h-full rounded-lg md:rounded-xl overflow-hidden'>
                                <Image 
                                    src={apartment?.images&&Object.values(apartment?.images)[0]?.preview_url || '/placeholder.jpg'} 
                                    alt={apartment?.title??'image'} 
                                    width={200}
                                    height={200}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='w-[70%] h-full flex flex-col gap-2'>
                                <p className='text-[.8em] md:text-[1em] font-semibold'>{apartment.title}</p>
                                <div className='flex items-center gap-4'>
                                    <div className='flex items-center gap-1'>
                                        <Home className='text-orange-500 w-4 md:w-5 h-4 md:h-5'/>
                                        <span className='text-[.7em] md:text-[.9em]'>{apartment.category}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <MapPin className='text-orange-500 w-4 md:w-5 h-4 md:h-5'/>
                                        <span className='text-[.7em] md:text-[.9em]'>{`${apartment.city_code}, ${apartment.country_code}`}</span>
                                    </div>
                                </div>
                                <div className='flex flex-wrap items-center gap-2'>
                                    <div className='flex items-center gap-1'>
                                        <Bed className='text-orange-500 w-4 md:w-5 h-4 md:h-5'/>
                                        <span className='text-[.7em] md:text-[.9em]'>{apartment.number_of_rooms} Bedrooms</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Scaling className='text-orange-500 w-4 md:w-5 h-4 md:h-5'/>
                                        <span className='text-[.7em] md:text-[.9em]'>{apartment.city_code}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Banknote className='text-orange-500 w-4 md:w-5 h-4 md:h-5'/>
                                        <span className='text-[.7em] md:text-[.9em]'>{apartment.amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    ))}
                </div>
            </div>

            <div className='relative z-0 w-full min-h-[300px] lg:h-full flex items-end overflow-hidden'>
                <Maps/>
            </div>
        </div>
    );
};

export default PointContact;