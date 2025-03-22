'use client'
'use client'
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Trash2, Search } from 'lucide-react';
import { getUsers, deleteUser, User } from '../api/userApi';
import { useRouter } from 'next/navigation';

export default function ViewAgents() {
  const [agents, setAgents] = useState<User[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const router = useRouter();

  const fetchAgents = async (page: number, search: string) => {
    try {
      setIsLoading(true);
      const response = await getUsers(page, search, 'agents');
      // Filter agents to only show those with account.slug === 'agents'
      const filteredAgents = response.data.filter(user => user?.account?.slug === 'agents');
      setAgents(filteredAgents);
      setTotalPages(Math.ceil(response.total / response.per_page));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAgents(currentPage, searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage]);

  const handleDelete = async (agentId: number) => {
    try {
      await deleteUser(agentId);
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
      fetchAgents(currentPage, searchTerm);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agents</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No agents found
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>{agent.business_name || 'N/A'}</TableCell>
                <TableCell>{agent.phone || agent.business_phone || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedAgent(agent)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agent Details</DialogTitle>
                        </DialogHeader>
                        {selectedAgent && (
                          <div className="grid gap-4">
                            <div>
                              <h3 className="font-medium">Personal Information</h3>
                              <p>Name: {selectedAgent.name}</p>
                              <p>Email: {selectedAgent.email}</p>
                              <p>Phone: {selectedAgent.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <h3 className="font-medium">Business Information</h3>
                              <p>Business Name: {selectedAgent.business_name || 'N/A'}</p>
                              <p>Business Email: {selectedAgent.business_email || 'N/A'}</p>
                              <p>Business Phone: {selectedAgent.business_phone || 'N/A'}</p>
                              <p>Business Address: {selectedAgent.business_address || 'N/A'}</p>
                            </div>
                            <div>
                              <h3 className="font-medium">Location</h3>
                              <p>Country: {selectedAgent.country || 'N/A'}</p>
                              <p>State: {selectedAgent.state || 'N/A'}</p>
                              <p>City: {selectedAgent.city || 'N/A'}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this agent? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(agent.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

    <div className="flex justify-center gap-2 mt-4">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  </div>
);
}