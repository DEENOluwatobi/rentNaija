// app/api/register/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import {baseURL} from "@/../next.config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // console.log('Registration request body:', body); // Debug log

    const response = await axios.post(
        baseURL+'/register',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );

    // console.log('API Response:', response.data); // Debug log
    return NextResponse.json(response.data);

  } catch (error: any) {
    // Detailed error logging
    console.error('Registration error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    // If we have a specific error message from the API
    if (error.response?.data?.message) {
      return NextResponse.json(
        { message: error.response.data.message },
        { status: error.response.status }
      );
    }

    // If we have validation errors
    if (error.response?.data?.errors) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.response.data.errors },
        { status: 422 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}