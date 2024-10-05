"use server"
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { deleteToken, getToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINT } from '@/configs/default';

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/auth/change-password/`;

type requestType = {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export const PUT = async (request: NextRequest) => {
    const requestData: requestType = await request.json()
    try {
        const accessToken = await getToken();
        await axios.put(EXTERNAL_API, requestData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        deleteToken();
        return NextResponse.json({"Changed": true}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({"changed": false}, {status: 400})
    }
}
