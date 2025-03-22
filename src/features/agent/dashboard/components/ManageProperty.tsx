'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {baseURL} from "@/../next.config";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  name: string;
  file_name: string;
  uuid: string;
  preview_url: string;
  original_url: string;
  order: string;
}

interface Video {
  name: string;
  file_name: string;
  uuid: string;
  preview_url: string;
  original_url: string;
  order: string;
}

interface Property {
  id: number;
  agent: string;
  my_apartment: boolean;
  category_id: string;
  category: string;
  title: string;
  description: string;
  number_of_rooms: string;
  amount: string;
  security_deposit: string;
  duration: string;
  amenities: string[];
  country_code: string;
  state_code: string;
  city_code: string;
  published: boolean;
  can_rate: boolean;
  can_advertise: boolean;
  images: Record<string, Image>;
  videos: Record<string, Video>;
  thumbnail: string | null;
  views_count: number;
  likes_count?:number;
}

interface PaginatedResponse {
  current_page: number;
  data: Property[];
  first_page_url: string;
  from: number;
  last_page: number;
  per_page: number;
  total: number;
}

const ManageProperty: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const token = useSelector((state: any) => state.agent.token);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<{ success: boolean; message: string; data: PaginatedResponse }>(
            baseURL+'/my-apartments',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data?.success && response.data?.data?.data) {
          setProperties(response.data.data.data);
          setTotalPages(response.data.data.last_page);
          setCurrentPage(response.data.data.current_page);
        } else {
          setError('Invalid data format received from server');
          //console.error('Invalid response format:', response.data);
        }
        setLoading(false);
      } catch (err) {
        //console.error('Error fetching properties:', err);
        setError('Failed to load properties');
        setLoading(false);
      }
    };
    fetchProperties();
  }, [token]);

  const getFirstImageUrl = (property: Property) => {
    const images = Object.values(property.images);
    return images.length > 0 ? images[0].original_url : '/placeholder-image.jpg';
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredProperties = properties.filter(
    (property) =>
      property?.title?.toLowerCase().includes(searchQuery) ||
      property?.category?.toLowerCase().includes(searchQuery) ||
      property?.state_code?.toLowerCase().includes(searchQuery)
  );

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDialogOpen(true);
  };

  const handleDelete = async (propertyId: number) => {
    if (!token) {
      setError('Authentication token not found');
      return;
    }
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(baseURL+`/apartment/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProperties((prev) => prev.filter((property) => property.id !== propertyId));
        alert('Property deleted successfully!');
      } catch (err) {
        //console.error('Error deleting property:', err);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className=' px-4 py-8'>
      
      <h1 className="text-black/80 text-[1.5rem] font-semibold">Manage Properties</h1>
    <div className="w-full flex flex-col items-center gap-4 ">
      <div className='w-full'>
        
      <div className="mb-6  max-w-2xl w-2/3 md:w-1/4">
        <input
          type="text"
          placeholder="Search properties by title, category, or location..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full text-[.8em] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-xl">
            <thead>
              <tr className="text-left bg-black/80 rounded-xl">
                <th className="p-4 text-[.8em] font-medium text-white">Image</th>
                <th className="p-4 text-[.8em] font-medium text-white">Title</th>
                <th className="p-4 text-[.8em] font-medium text-white">Category</th>
                <th className="p-4 text-[.8em] font-medium text-white">Rooms</th>
                <th className="p-4 text-[.8em] font-medium text-white">Amount</th>
                <th className="p-4 text[.8em] font-medium text-white">Stats</th>
                <th className="p-4 text-[.8em] font-medium text-white">Location</th>
                <th className="p-4 text-[.8em] font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handlePropertyClick(property)}
                >
                  <td className="p-4">
                    <img
                      src={getFirstImageUrl(property)}
                      alt={property.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </td>
                  <td className="p-4 text-gray-700 text-[.8em]">{property.title}</td>
                  <td className="p-4 text-gray-700 text-[.8em]">{property.category}</td>
                  <td className="p-4 text-gray-700 text-[.8em]">{property.number_of_rooms}</td>
                  <td className="p-4 text-gray-700 text-[.8em]">{property.amount}</td>
                  <td className='p-4 text0-gray-700 text-[.8em]'><span>{property?.views_count} views</span> <span>{property?.likes_count} Likes</span></td>
                  <td className="p-4 text-gray-700 text-[.8em]">
                    {`${property.city_code}, ${property.state_code}`}
                  </td>
                  <td className="p-4 text-gray-700 text-[.8em]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(property.id);
                      }}
                      className="px-4 py-2 bg-red-500 text-white text-[.8em] rounded hover:bg-red-600 focus:outline-none"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           <div className="flex items-center justify-center space-x-2 py-4">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                          >
                              <ChevronLeft className="h-4 w-4"/>
                          </Button>
                          <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                          >
                              <ChevronRight className="h-4 w-4"/>
                          </Button>
                      </div>
                  </div>
         
      ) : (
        <div className="text-center text-gray-500 py-8">No properties found</div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="w-full space-y-6">
              {/* Image Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.values(selectedProperty.images).map((image) => (
                  <img
                    key={image.uuid}
                    src={image.original_url}
                    alt={image.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* Video Gallery */}
              {Object.values(selectedProperty.videos).length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(selectedProperty.videos).map((video) => (
                      <video
                        key={video.uuid}
                        controls
                        className="w-full rounded-lg"
                      >
                        <source src={video.original_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Property Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="font-medium">Category:</p>
                    <p>{selectedProperty.category}</p>
                    <p className="font-medium">Rooms:</p>
                    <p>{selectedProperty.number_of_rooms}</p>
                    <p className="font-medium">Amount:</p>
                    <p>{selectedProperty.amount}</p>
                    <p className="font-medium">Security Deposit:</p>
                    <p>{selectedProperty.security_deposit || 'N/A'}</p>
                    <p className="font-medium">Duration:</p>
                    <p>{selectedProperty.duration}</p>
                    <p className="font-medium">Agent:</p>
                    <p>{selectedProperty.agent}</p>
                    <p className="font-medium">Views:</p>
                    <p>{selectedProperty.views_count}</p>
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Location</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="font-medium">Country:</p>
                    <p>{selectedProperty.country_code}</p>
                    <p className="font-medium">State:</p>
                    <p>{selectedProperty.state_code}</p>
                    <p className="font-medium">City:</p>
                    <p>{selectedProperty.city_code}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm text-gray-700">{selectedProperty.description}</p>
              </div>

              {/* Amenities */}
              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">Status</h3>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedProperty.published
                      ? 'bg-green-100 text-green-500'
                      : 'bg-orange-100 text-orange-500'
                  }`}>
                    {selectedProperty.published ? 'Published' : 'Unpublished'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedProperty.can_rate
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedProperty.can_rate ? 'Can Rate' : 'Cannot Rate'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedProperty.can_advertise
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedProperty.can_advertise ? 'Can Advertise' : 'Cannot Advertise'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
};

export default ManageProperty;