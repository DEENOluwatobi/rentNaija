'use client'
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Image, Video, X } from 'lucide-react';
import { useAlert } from '@/contexts/AlertContext';

interface Category {
  id: number;
  title: string;
  slug: string;
}

interface PropertyFormData {
  category_id: number;
  title: string;
  description: string | null;
  number_of_rooms: number | null;
  amount: number;
  currency_code: string;
  security_deposit: number | null;
  security_deposit_currency_code: string | null;
  duration: number;
  duration_type: 'day' | 'week' | 'month' | 'year';
  amenities: string[];
  country_code: string;
  state_code: string;
  city_code: string;
  image1: File | null;
  image2: File | null;
  image3: File | null;
  image4: File | null;
  image5: File | null;
  video1: File | null;
  video2: File | null;
  video3: File | null;
  video4: File | null;
  video5: File | null;
}

type FileType = 'image' | 'video';
type PreviewMap = { [key: string]: string };

// Predefined amenities list
const AVAILABLE_AMENITIES = [
  'WiFi',
  'Parking',
  'Air Conditioning',
  'Swimming Pool',
  'Gym',
  'Security',
  'Furnished',
  'Balcony',
  'Garden',
  'Pet Friendly',
  'Elevator',
  'CCTV',
  'Generator',
  'Water Supply',
  'Kitchen'
];

const AddProperty: React.FC = () => {
  const { showAlert } = useAlert();
  const [step, setStep] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<PreviewMap>({});
  const [videoPreview, setVideoPreview] = useState<PreviewMap>({});
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm<PropertyFormData>({
    defaultValues: {
      amenities: [],
      currency_code: 'NGN',
      country_code: 'NG'
    }
  });

  const imageFields: string[] = ['image1', 'image2', 'image3', 'image4', 'image5'];
  const videoFields: string[] = ['video1', 'video2', 'video3', 'video4', 'video5'];
  const MAX_IMAGE_SIZE: number = 3 * 1024 * 1024;
  const MAX_VIDEO_SIZE: number = 10 * 1024 * 1024;

  // Handle amenities selection
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity];
      setValue('amenities', newAmenities);
      return newAmenities;
    });
  };

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const response = await axios.get<{ success: boolean; data: Category[] }>(
          'https://api.rent9ja.com.ng/api/apartment-types',
          {
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`,
              'Accept': 'application/json',
            },
            withCredentials: true 
          }
        );
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          showAlert('Please login to continue', 'error');
        }
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (fieldName: string, type: FileType) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      showAlert(`File ${file.name} exceeds maximum size limit of ${maxSize / (1024 * 1024)}MB`, 'error');
      return;
    }

    setValue(fieldName as keyof PropertyFormData, file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'image') {
        setImagePreview(prev => ({ ...prev, [fieldName]: reader.result as string }));
      } else {
        setVideoPreview(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (fieldName: string, type: FileType): void => {
    setValue(fieldName as keyof PropertyFormData, null);
    if (type === 'image') {
      setImagePreview(prev => {
        const newPreview = { ...prev };
        delete newPreview[fieldName];
        return newPreview;
      });
    } else {
      setVideoPreview(prev => {
        const newPreview = { ...prev };
        delete newPreview[fieldName];
        return newPreview;
      });
    }
  };

  const validateStep = async (): Promise<boolean> => {
    let fieldsToValidate: Array<keyof PropertyFormData> = [];
    switch (step) {
      case 1:
        fieldsToValidate = ['category_id', 'title', 'number_of_rooms', 'description'];
        break;
      case 2:
        fieldsToValidate = ['amount', 'currency_code', 'security_deposit'];
        break;
      case 3:
        fieldsToValidate = ['duration', 'duration_type', 'amenities'];
        break;
      case 4:
        fieldsToValidate = ['country_code', 'state_code', 'city_code'];
        break;
      case 5:
        // Validate that at least one image and one video is selected
        const hasImage = imageFields.some(field => watch(field as keyof PropertyFormData));
        const hasVideo = videoFields.some(field => watch(field as keyof PropertyFormData));
        if (!hasImage) {
          showAlert('Please upload at least one image', 'info');
          return false;
        }
        if (!hasVideo) {
          showAlert('Please upload at least one video', 'info');
          return false;
        }
        return true;
    }
    
    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async (): Promise<void> => {
    const isValid = await validateStep();
    if (isValid) {
      setStep(current => Math.min(current + 1, 5));
    }
  };

  const prevStep = (): void => {
    setStep(current => Math.max(current - 1, 1));
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (step !== 5) {
      return;
    }

    // Validate files before submission
    const hasImage = imageFields.some(field => data[field as keyof PropertyFormData]);
    const hasVideo = videoFields.some(field => data[field as keyof PropertyFormData]);

    if (!hasImage || !hasVideo) {
      showAlert('Please upload at least one image and one video', 'error');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    
    // Add all form fields to formData
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (key === 'amenities') {
        formData.append(key, JSON.stringify(selectedAmenities));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Set published and can_rate to false
    formData.append('published', 'false');
    formData.append('can_rate', 'false');

    try {
      const token = getAuthToken();
      if (!token) {
        showAlert('Please login to add a property', 'error');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        'https://api.rent9ja.com.ng/api/apartment', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true 
        }
      );

      if (response.data.success) {
        showAlert('Property successfully added!', 'success');
        // Reset all form fields
        setValue('category_id', 0);
        setValue('title', '');
        setValue('description', null);
        setValue('number_of_rooms', null);
        setValue('amount', 0);
        setValue('currency_code', 'NGN');
        setValue('security_deposit', null);
        setValue('security_deposit_currency_code', null);
        setValue('duration', 0);
        setValue('duration_type', 'month');
        setValue('amenities', []);
        setValue('country_code', 'NG');
        setValue('state_code', '');
        setValue('city_code', '');
        
        // Reset file fields
        imageFields.forEach(field => setValue(field as keyof PropertyFormData, null));
        videoFields.forEach(field => setValue(field as keyof PropertyFormData, null));
        
        // Clear previews
        setImagePreview({});
        setVideoPreview({});
        
        // Reset amenities
        setSelectedAmenities([]);
        
        // Reset to first step
        setStep(1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          showAlert('Your session has expired. Please login again.', 'error');
        } else if (error.response?.status === 503) {
          showAlert('Service temporarily unavailable. Please try again later.', 'error');
        } else {
          showAlert(error.response?.data?.message || 'Failed to add property. Please try again.', 'error');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col px-2 md:px-6 py-2 md:py-6 gap-2 md:gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-black/80 text-[1.5rem] font-semibold">Add New Property</h1>
        <span className="text-orange-500 font-medium">Step {step} / 5</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 bg-black/80 rounded-xl shadow-md shadow-orange-600 p-4">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Property Category</label>
              <select
                {...register('category_id', { required: 'Category is required' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Number of Rooms</label>
              <input
                type="number"
                {...register('number_of_rooms')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Description</label>
              <textarea
                {...register('description')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Amount</label>
              <input
                type="number"
                {...register('amount', { required: 'Amount is required' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Currency Code</label>
              <input
                {...register('currency_code', { required: 'Currency code is required' })}
                defaultValue="NGN"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.currency_code && <p className="text-red-500 text-sm">{errors.currency_code.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Security Deposit</label>
              <input
                type="number"
                {...register('security_deposit')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Duration</label>
              <input
                type="number"
                {...register('duration', { required: 'Duration is required' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Duration Type</label>
              <select
                {...register('duration_type', { required: 'Duration type is required' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
              {errors.duration_type && <p className="text-red-500 text-sm">{errors.duration_type.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {AVAILABLE_AMENITIES.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Country Code</label>
              <input
                {...register('country_code', { required: 'Country code is required' })}
                defaultValue="NG"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.country_code && <p className="text-red-500 text-sm">{errors.country_code.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">State Code</label>
              <input
                {...register('state_code', { required: 'State code is required' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.state_code && <p className="text-red-500 text-sm">{errors.state_code.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">City Code</label>
              <input
                {...register('city_code', { required: 'City code is required' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.city_code && <p className="text-red-500 text-sm">{errors.city_code.message}</p>}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Images (At least 1 required, max 5, each &lt;3MB)</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {imageFields.map((field) => (
                  <div key={field} className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange(field, 'image')}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full aspect-square border-2 border-gray-300 border-dashed flex items-center justify-center rounded-lg bg-gray-100 group-hover:border-orange-500 transition-all relative">
                      {imagePreview[field] ? (
                        <>
                          <img src={imagePreview[field]} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeFile(field, 'image')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <Image className="text-gray-400 w-8 h-8 group-hover:text-orange-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Videos (At least 1 required, max 5, each &lt;10MB)</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {videoFields.map((field) => (
                  <div key={field} className="relative group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange(field, 'video')}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full aspect-square border-2 border-gray-300 border-dashed flex items-center justify-center rounded-lg bg-gray-100 group-hover:border-orange-500 transition-all relative">
                      {videoPreview[field] ? (
                        <>
                          <video src={videoPreview[field]} className="w-full h-full object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeFile(field, 'video')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <Video className="text-gray-400 w-8 h-8 group-hover:text-orange-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Previous
            </button>
          )}
          
          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="ml-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Property'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProperty;