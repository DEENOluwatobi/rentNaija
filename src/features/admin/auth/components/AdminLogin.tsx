'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { loginAdmin } from '@/redux/adminSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useAlert } from '@/contexts/AlertContext';



const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    account_id: z.number().optional(),  
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdminLogin: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { showAlert } = useAlert();
    const { isLoading, error } = useSelector((state: RootState) => state.admin);
    
    const accountId = 4;  

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { account_id: accountId },  // Set default value
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await dispatch(loginAdmin({ ...data, account_id: accountId })).unwrap();
            if (result) {
                showAlert("Login successful. Welcome!", "success");
                router.push('/admin/dashboard');
            }
        } catch (error: any) {
            showAlert(error || "Login failed", "error");
        }
    };

    return (
        <div className="flex items-center justify-center p-4 md:p-8">
            <Card className="w-[90%] md:w-[400px] p-2 md:p-4 border-none bg-white shadow-md">
                <CardHeader className='flex items-center justify-center flex-col gap-2'>
                    <CardTitle className='poppins text-orange-500'>Admin Login</CardTitle>
                    <CardDescription className='text-sm text-center'>
                        Sign in to access the admin dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className='border border-orange-400 text-gray-700'>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="admin@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register('password')}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Hidden account_id input */}
                        <input type="hidden" {...register("account_id")} />

                        <Button
                            type="submit"
                            className="w-full text-white bg-orange-500 hover:bg-orange-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};


export default AdminLogin;