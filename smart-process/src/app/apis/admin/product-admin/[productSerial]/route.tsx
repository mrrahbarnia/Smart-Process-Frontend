"use server"
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getToken, deleteToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINT } from '@/configs/default';

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/admin/product-detail`;

export const GET = async (request: NextRequest, {params}: {params: {productSerial: string}}) => {
    const productSerial = params.productSerial;

    try {
        const accessToken = await getToken();
        const result = await axios.get(`${EXTERNAL_API}/${productSerial}/`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        return NextResponse.json(result.data, {status: 200})
    } catch (error) {
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
            if (error.response?.data && error.response?.data.detail === 'Could not validate credentials' ) {
                deleteToken();
                errorMessage = 'Could not validate credentials';
                return NextResponse.json({"fetched": false}, {status: 403})
            }
        } else {
            errorMessage = "Something went wrong";
            return NextResponse.json({"message": errorMessage}, {status: 400})
        }
    }
};
