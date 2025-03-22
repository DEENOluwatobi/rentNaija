import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {baseURL} from "@/../next.config";

interface AdminState {
    isLoggedIn: boolean;
    token: string | null;
    firstName: string;
    lastName: string;
    email: string;
    isLoading: boolean;
    error: string | null;
    userId?: number;
    accountType?: string;
    role?: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        account: {
            id: number;
            name: string;
            slug: string;
        };
    };
}

const initialState: AdminState = {
    isLoggedIn: false,
    token: null,
    firstName: '',
    lastName: '',
    email: '',
    isLoading: false,
    error: null,
    userId: undefined,
    accountType: undefined,
    role: undefined
};

// Safe localStorage access
const isClient = typeof window !== 'undefined';

const getFromStorage = (key: string): string | null => {
    if (!isClient) return null;
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
    }
};

const setToStorage = (key: string, value: string): void => {
    if (!isClient) return;
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error('Error setting localStorage:', error);
    }
};

const removeFromStorage = (key: string): void => {
    if (!isClient) return;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};

// Load initial state from localStorage
const loadInitialState = (): AdminState => {
    const token = getFromStorage('adminToken');
    const savedState = getFromStorage('adminState');
    
    if (token && savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            return {
                ...initialState,
                ...parsedState,
                token,
                isLoading: false,
                error: null
            };
        } catch (error) {
            console.error('Error parsing stored state:', error);
        }
    }
    return initialState;
};

export const loginAdmin = createAsyncThunk(
    'admin/login',
    async ({ email, password,account_id }: { email: string; password: string ,account_id:number}, { rejectWithValue }) => {
        try {
            const response = await axios.post<LoginResponse>(baseURL+"/login", {
                email,
                password,
                account_id
            });

            const { data } = response;

            if (data.user.account.id !== 4) {
                return rejectWithValue('Invalid account type. Please use admin credentials.');
            }

            const nameParts = data.user.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const persistState = {
                isLoggedIn: true,
                userId: data.user.id,
                accountType: data.user.account.slug,
                firstName,
                lastName,
                email: data.user.email,
                role: 'admin'
            };

            setToStorage('adminToken', data.token);
            setToStorage('adminState', JSON.stringify(persistState));

            return {
                token: data.token,
                ...persistState
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logoutAdmin = createAsyncThunk(
    'admin/logout',
    async (_, { rejectWithValue }) => {
        try {
            const token = getFromStorage('adminToken');
            if (token) {
                await axios.post(
                    baseURL+'/logout',
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    }
                );
            }
            removeFromStorage('adminToken');
            removeFromStorage('adminState');
            return null;
        } catch (error) {
            // Even if the logout API fails, we still want to clear local state
            removeFromStorage('adminToken');
            removeFromStorage('adminState');
            return null;
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: loadInitialState(),
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        initializeFromStorage: (state) => {
            const storedState = loadInitialState();
            Object.assign(state, storedState);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.isLoading = false;
                state.token = action.payload.token;
                state.firstName = action.payload.firstName;
                state.lastName = action.payload.lastName;
                state.email = action.payload.email;
                state.userId = action.payload.userId;
                state.accountType = action.payload.accountType;
                state.role = action.payload.role;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isLoggedIn = false;
            })
            .addCase(logoutAdmin.fulfilled, (state) => {
                Object.assign(state, initialState);
            });
    }
});

export const { clearError, initializeFromStorage } = adminSlice.actions;
export default adminSlice.reducer;



//SAMPLE DATA RESPONSE
// {
//   "success": true,
//   "message": "Login Successful",
//   "token": "64|gPGHf8O4RHysx1wJaymzHaG3qS1MZ6FkcoLzQ11C11fb64f2",
//   "user": {
//     "id": 16,
//     "account_id": "4",
//     "name": "akinlade mathew",
//     "email": "rentnaija25@gmail.com",
//     "phone": null,
//     "long": null,
//     "lat": null,
//     "email_verified_at": null,
//     "deleted_at": null,
//     "current_team_id": null,
//     "profile_photo_path": null,
//     "created_at": "2025-02-16T21:42:34.000000Z",
//     "updated_at": "2025-02-16T21:42:34.000000Z",
//     "business_name": null,
//     "country": null,
//     "state": null,
//     "city": null,
//     "business_email": null,
//     "business_phone": null,
//     "business_address": null,
//     "account": {
//       "id": 4,
//       "name": "Admins",
//       "slug": "admins",
//       "description": "Administrator in charge of accounts",
//       "deleted_at": null,
//       "created_at": "2025-02-05T04:37:08.000000Z",
//       "updated_at": "2025-02-05T04:37:08.000000Z"
//     },
//     "apartments": [],
//     "rented_apartments": [],
//     "user_settings": []
//   }
// }