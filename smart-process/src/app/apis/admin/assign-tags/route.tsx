"use server"
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getToken, deleteToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINT } from '@/configs/default';

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/admin/assign-tag`;

type ResponseType = {
    tagName: string,
    articleId: number
}

export const POST = async (request: NextRequest) => {
    const data: ResponseType = await request.json()

    try {
        const accessToken = await getToken();
        await axios.post(`${EXTERNAL_API}/${data.articleId}/tag/${data.tagName}/`, {}, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        return NextResponse.json({"assigned": true}, {status: 200})
    } catch (error) {
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
            if (error.response?.data && error.response?.data.detail === 'Could not validate credentials' ) {
                deleteToken();
                errorMessage = 'Could not validate credentials';
                return NextResponse.json({"successful": false}, {status: 403})
            }
            if (error.response?.data && error.response?.data.detail) {
                return NextResponse.json({"detail": error.response?.data && error.response?.data.detail}, {status: 400})
            }
        } else {
            errorMessage = "Something went wrong";
            return NextResponse.json({"message": errorMessage}, {status: 400})
        }
    }
}
