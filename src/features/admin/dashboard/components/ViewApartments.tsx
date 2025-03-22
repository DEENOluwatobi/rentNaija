'use client'
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {getAllApartments, deleteApartment, type Apartment} from '../api/get-all-apartments';
import {Search, ChevronLeft, ChevronRight,   Pencil} from 'lucide-react';
import {updateApartment} from "../api/get-all-apartments";
import Link from "next/link";
import { DialogDescription } from '@radix-ui/react-dialog';

const ViewApartment = () => {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
    const isLoggedIn = useSelector((state: any) => state.admin.isLoggedIn);

    const fetchApartments = async () => {
        try {
            setLoading(true);
            const response = await getAllApartments(currentPage, searchTerm);

            if (response.success && response.data) {
                setApartments(response.data.data);
                setTotalPages(Math.ceil(response.data.total / 20));
            } else {
                throw new Error('Invalid response format');
            }

            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch apartments');
            setApartments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchApartments().then(r => r);
        }
    }, [currentPage, searchTerm, isLoggedIn]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this apartment?')) {
            try {
                await deleteApartment(id);
                await fetchApartments();
            } catch (err: any) {
                setError(err.message || 'Failed to delete apartment');
            }
        }
    };

    const handlePublish = async (id: number, dir: boolean) => {
        if (window.confirm('Please Confirm Action')) {
            try {
                await updateApartment(id, {published: dir});
                await fetchApartments();
            } catch (err: any) {
                setError(err.message || 'Failed to delete apartment');
            }
        }
    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (!isLoggedIn) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Please log in to view apartments
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search apartments..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : !Array.isArray(apartments) || apartments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No apartments found
                                </TableCell>
                            </TableRow>
                        ) : (
                            apartments.map((apartment) => (
                                <TableRow key={apartment.id}>
                                    <TableCell>
                                        <div className='w-14 h-14 rounded-md overflow-hidden'>
                                            <img
                                                src={Object.values(apartment.images)[0]?.original_url || '/api/placeholder/400/300'}
                                                alt={apartment.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="link"
                                                    onClick={() => setSelectedApartment(apartment)}
                                                >
                                                    {apartment.title}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                <DialogDescription>{apartment.title} </DialogDescription>
                                                    {/* <DialogTitle>{apartment.title}</DialogTitle> */}
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <img
                                                            src={Object.values(apartment.images)[0]?.original_url || '/api/placeholder/400/300'}
                                                            alt={apartment.title}
                                                            className="w-full rounded-lg"
                                                        />
                                                        <div>
                                                            <h3 className="font-semibold mb-2">Details</h3>
                                                            <p><strong>Category:</strong> {apartment.category}</p>
                                                            <p><strong>Rooms:</strong> {apartment.number_of_rooms}</p>
                                                            <p><strong>Price:</strong> {apartment.amount}</p>
                                                            <p><strong>Duration:</strong> {apartment.duration}</p>
                                                            <p>
                                                                <strong>Location:</strong> {apartment.city_code}, {apartment.state_code}
                                                            </p>
                                                            <p><strong>Agent:</strong> {apartment.agent}</p>
                                                            <p><strong>Agent Email:</strong> {apartment.agent_email}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Description</h3>
                                                        <p>{apartment.description}</p>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell>{apartment.category}</TableCell>
                                    <TableCell>{`${apartment.city_code}, ${apartment.state_code}`}</TableCell>
                                    <TableCell>{apartment.amount}</TableCell>
                                    <TableCell className={'flex '}>
                                        <Link  className={"mt-1"} href={"/admin/dashboard/edit-apartment/"+apartment.id}>
                                            <Pencil />
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className='bg-red-500 text-white px-4 py-1 mx-3 rounded-md'
                                            onClick={() => handleDelete(apartment.id)}
                                        >
                                            Delete
                                        </Button>
                                        {
                                             !apartment.published ? <Button
                                                variant="outline"
                                                size="sm"
                                                className='bg-green-500 text-white px-4 py-1 mx-3 rounded-md'
                                                onClick={() => handlePublish(apartment.id, true)}
                                            >
                                                Publish
                                            </Button> : <Button
                                                variant="outline"
                                                size="sm"
                                                className='bg-red-500 text-white px-4 py-1 mx-3 rounded-md'
                                                onClick={() => handlePublish(apartment.id, false)}
                                            >
                                                UnPublish
                                            </Button>
                                        }

                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
    );
};

export default ViewApartment;