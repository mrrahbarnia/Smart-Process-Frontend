"use server"
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getToken, deleteToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINT } from '@/configs/default';

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/admin/all-brands/`;

export const GET = async (request: NextRequest) => {
    try {
        const url = new URL(request.url);
        const page = url.searchParams.get("page") || "1";
        const accessToken = await getToken();
        const result = await axios.get(`${EXTERNAL_API}?page=${page}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        return NextResponse.json(result.data, {status: 200})
    } catch {
        deleteToken();
        return NextResponse.json({"fetched": false}, {status: 403})
    }
}
