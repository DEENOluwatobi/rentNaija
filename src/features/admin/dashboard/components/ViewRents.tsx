'use client'
import React, { useEffect, useState } from 'react';
import { rentApi, RentDetails, PaginatedResponse } from '../api/rentApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const ViewRents = () => {
  const [rentData, setRentData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchRents();
  }, []);

  const fetchRents = async () => {
    try {
      setLoading(true);
      const data = await rentApi.getAllRents();
      setRentData(data);
    } catch (error) {
      //console.error('Fetch Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch rent requests",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (rentId: number) => {
    setActionLoading(rentId);
    try {
      await rentApi.activateRent(rentId);
      toast({
        title: "Success",
        description: "Rent request confirmed successfully",
      });
      fetchRents();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to confirm rent request",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (rentId: number) => {
    setActionLoading(rentId);
    try {
      await rentApi.archiveRent(rentId);
      toast({
        title: "Success",
        description: "Rent request archived successfully",
      });
      fetchRents();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to archive rent request",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!rentData || !rentData.data || rentData.data.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Rent Requests</h1>
        <div className="text-center py-8">
          No rent requests found.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-6 px-4 poppins">
      <h1 className="text-2xl font-bold mb-6">Rent Requests</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Move In Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentData.data.map((rent) => (
              <TableRow key={rent.id}>
                <TableCell>{rent.id}</TableCell>
                <TableCell>{rent.status}</TableCell>
                <TableCell>{rent.duration}</TableCell>
                <TableCell>{rent.amount}</TableCell>
                <TableCell>{new Date(rent.move_in_date).toLocaleDateString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleConfirm(rent.id)}
                    disabled={actionLoading === rent.id}
                  >
                    {actionLoading === rent.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={actionLoading === rent.id}
                      >
                        Archive
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently archive the rent request.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleArchive(rent.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {actionLoading === rent.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Archive"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination info */}
      <div className="text-sm text-gray-500 mt-4">
        Showing {rentData.from} to {rentData.to} of {rentData.total} entries
      </div>
    </div>
  );
};

export default ViewRents;