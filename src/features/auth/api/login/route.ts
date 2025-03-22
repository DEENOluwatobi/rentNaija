import { NextResponse } from 'next/server';
import axios from 'axios';
import {baseURL} from "@/../next.config";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password,account_type_id } = body;

        // Make request to the external API
        const response = await axios({
            method: 'POST',
            url: baseURL+'/login',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                email,
                password,
                account_type_id
            }
        });

        // If the request is successful, return the data
        return NextResponse.json(response.data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error: any) {
        // Handle different types of errors
        const errorMessage = error.response?.data?.message || "Login failed";
        const statusCode = error.response?.status || 500;
        
        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}