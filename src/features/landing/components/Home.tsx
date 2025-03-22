'use client'
import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/variants';
import { HomeIcon, Star, Target, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Apartment, ApiResponse } from '@/types/apartment';
import House from '@/components/assets/house1.jpeg';
import House2 from '@/components/assets/house2.jpeg';
import House3 from '@/components/assets/house4.jpeg';
import House4 from '@/components/assets/house5.jpeg';

const Home: React.FC = () => {
    const images = [
        House,
        House2,
        House3,
        House4
    ];
    const [searchParams, setSearchParams] = useState({
        category: '',
        state: '',
        country: 'NGA' 
    });
    const [searchResults, setSearchResults] = useState<Apartment[]>([]);
    const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<string[]>([]);
    const [states, setStates] = useState<string[]>([]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(images.length).fill(false));
    const [isReady, setIsReady] = useState(false);

    // Modified fetchOptions to only get categories and states
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('/api/apartments');
                const data: ApiResponse = await response.json();
                
                if (data.success) {
                     
                     const uniqueStates = [...new Set(data.data.data.map(apt => apt.state_code))]
                     .filter((category): category is string => category !== undefined);
                     
                     const uniqueCategories = [...new Set(data.data.data.map(apt => apt.category))]
                    .filter((category): category is string => category !== undefined);
                    setCategories(uniqueCategories); 
                    setStates(uniqueStates);
                }
            } catch (error) {
                //console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

    // Preload images
    useEffect(() => {
        const imagePromises = images.map((image, index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = image.src;
                img.onload = () => {
                    setLoadedImages(prev => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                    });
                    resolve(true);
                };
            });
        });

        Promise.all(imagePromises).then(() => {
            setIsReady(true);
        });
    }, []);

    // Start slideshow only when images are loaded
    useEffect(() => {
        if (!isReady) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isReady, images.length]);

    // Loading screen
    if (!isReady) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
                <div className="text-white text-lg">
                    
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            
            // Only add parameters if they're not 'all'
            if (searchParams.category !== 'all') queryParams.append('category', searchParams.category);
            if (searchParams.state !== 'all') queryParams.append('state_code', searchParams.state);
            // Always include country_code=NGA
            queryParams.append('country_code', 'NGA');

            const response = await fetch(`/api/apartments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
            const data: ApiResponse = await response.json();

            if (data.success) {
                setSearchResults(data.data.data);
                setIsDialogOpen(true);
            } else {
                setError(data.message || 'Failed to fetch apartments');
            }
        } catch (error) {
            setError('Failed to fetch apartments');
            console.error('Error searching apartments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (value: string, field: 'category' | 'state') => {
        setSearchParams(prev => ({ ...prev, [field]: value }));
    };

    const ApartmentCard = ({ apartment }: { apartment: Apartment }) => (
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="aspect-video relative overflow-hidden rounded-lg">
                <img 
                    src={apartment?.images &&Object.values(apartment.images)[0]?.preview_url || '/placeholder.jpg'}
                    alt={apartment.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-lg">{apartment.title}</h3>
                <p className="text-sm text-gray-600">{apartment.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-semibold">{apartment.amount}</span>
                    <span className="text-sm text-gray-500">{apartment.duration}</span>
                </div>
                <button 
                    onClick={() => setSelectedApartment(apartment)}
                    className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                        backgroundImage: `url(${src.src})`,
                        backgroundSize: 'cover',
                    }}
                    aria-hidden={index !== currentImageIndex}
                />
            ))}

            <div className="hidden">
                {images.map((src, index) => (
                    <img 
                        key={`preload-${index}`}
                        src={src.src} 
                        alt="" 
                        className="hidden" 
                        onLoad={() => {
                            setLoadedImages(prev => {
                                const newState = [...prev];
                                newState[index] = true;
                                return newState;
                            });
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex items-center w-full h-full bg-black bg-opacity-40">
                <div className="w-full flex flex-col gap-6 px-2 md:px-6">
                    <motion.div 
                        variants={fadeIn('down', 0.1)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{ once: false, amount: 0.1 }}
                        className="w-full flex flex-col items-center lg:items-start gap-2"
                    >
                        <h1 className="text-[3em] md:text-[4em] lg:text-[5em] font-semibold text-orange-500">
                            Rent<span className="text-green-500">Naija</span>
                        </h1>
                        <p className="text-[1em] lg:text-[1.5em] text-center md:text-start md:leading-9 lg:max-w-[50%] font-semibold text-white">
                            Perfect Firm For Selling Or Leasing Houses, Flats, And Villas.
                        </p>
                    </motion.div>
                    
                    <div className="relative z-10 flex items-center w-full h-full">
                        <div className="w-full flex flex-col gap-6">
                            <motion.form
                                onSubmit={handleSearch}
                                variants={fadeIn('up', 0.1)}
                                initial='hidden'
                                whileInView={'show'}
                                viewport={{ once: false, amount: 0.1 }}
                                className="p-2 md:p-4 rounded-lg md:rounded-2xl bg-white shadow-lg w-full grid grid-cols-2 sm:grid-cols-3 items-center gap-2 md:gap-4"
                            >
                                <Select
                                    value={searchParams.category}
                                    onValueChange={(value) => handleSelectChange(value, 'category')}
                                >
                                    <SelectTrigger className="w-full h-8 md:h-12 text-[.8em] md:text-[.9em] bg-white text-black">
                                        <SelectValue placeholder="Type of property" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black">
                                        <SelectItem value="all">All Properties</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={searchParams.state}
                                    onValueChange={(value) => handleSelectChange(value, 'state')}
                                >
                                    <SelectTrigger className="w-full h-8 md:h-12 text-[.8em] md:text-[.9em] bg-white text-black">
                                        <SelectValue placeholder="State" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black">
                                        <SelectItem value="all">All States</SelectItem>
                                        {states.map((state) => (
                                            <SelectItem key={state} value={state}>
                                                {state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="col-span-2 sm:col-span-1 w-full px-2 py-2 h-9 md:h-12 text-[.9em] text-white rounded-md md:rounded-xl border border-gray-200 outline-none bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                                >
                                    {isLoading ? 'Searching...' : 'Search'}
                                </button>
                            </motion.form>

                            <motion.div
                                variants={fadeIn('up', 0.1)}
                                initial='hidden'
                                whileInView={'show'}
                                viewport={{ once: false, amount: 0.1 }}
                                className="w-[350px] mx-auto md:mx-0 md:w-full flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
                            >
                                <div className="flex items-center gap-3 bg-black bg-opacity-70 backdrop-blur-md px-4 py-4 rounded-lg">
                                    <HomeIcon className="text-orange-500 w-5 md:w-6 h-5 md:h-6"/>
                                    <span className="text-[.8em] md:text-[.9em] text-white">
                                        12a, Location Street, City, Country.
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 bg-black bg-opacity-70 backdrop-blur-md px-4 py-4 rounded-lg">
                                    <Target className="text-orange-500 w-5 md:w-6 h-5 md:h-6"/>
                                    <span className="text-[.8em] md:text-[.9em] text-white">
                                        Fast and Reliable.
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 bg-black bg-opacity-70 backdrop-blur-md px-4 py-4 rounded-lg">
                                    <div className="flex">
                                        <Star className="fill-orange-500 w-5 md:w-6 h-5 md:h-6"/>
                                        <Star className="fill-orange-500 w-5 md:w-6 h-5 md:h-6"/>
                                        <Star className="fill-orange-500 w-5 md:w-6 h-5 md:h-6"/>
                                        <Star className="fill-orange-500 w-5 md:w-6 h-5 md:h-6"/>
                                        <Star className="fill-orange-500 w-5 md:w-6 h-5 md:h-6"/>
                                    </div>
                                    <span className="text-[.8em] md:text-[.9em] text-white">
                                        4.8 Reviewed by people.
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Search Results</h2>
                                <button 
                                    onClick={() => setIsDialogOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            {error && (
                                <div className="text-red-500 mb-4">{error}</div>
                            )}

                            {searchResults.length === 0 && !error ? (
                                <div className="text-gray-500">No apartments found matching your criteria.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchResults.map((apartment) => (
                                        <ApartmentCard key={apartment.id} apartment={apartment} />
                                    ))}
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {selectedApartment && (
                        <Dialog open={!!selectedApartment} onOpenChange={() => setSelectedApartment(null)}>
                            <DialogContent className="max-w-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">{selectedApartment.title}</h2>
                                    <button 
                                        onClick={() => setSelectedApartment(null)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="aspect-video relative overflow-hidden rounded-lg">
                                        <img 
                                            src={selectedApartment?.images && Object.values(selectedApartment.images)[0]?.preview_url || '/placeholder.jpg'}
                                            alt={selectedApartment.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold">Details</h3>
                                            <p className="text-sm">Rooms: {selectedApartment.number_of_rooms}</p>
                                            <p className="text-sm">Category: {selectedApartment.category}</p>
                                            <p className="text-sm">Location: {`${selectedApartment.city_code}, ${selectedApartment.state_code}, ${selectedApartment.country_code}`}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Pricing</h3>
                                            <p className="text-sm">Amount: {selectedApartment.amount}</p>
                                            <p className="text-sm">Security Deposit: {selectedApartment.security_deposit}</p>
                                            <p className="text-sm">Duration: {selectedApartment.duration}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold">Description</h3>
                                        <p className="text-sm">{selectedApartment.description}</p>
                                    </div>

                                    {selectedApartment.amenities && selectedApartment.amenities.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold">Amenities</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedApartment.amenities.map((amenity, index) => (
                                                    <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Home;
