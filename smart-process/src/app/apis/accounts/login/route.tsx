"use server"
// @ts-expect-error Dont raise error
import jwt from 'jsonwebtoken';
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { setToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINT } from '@/configs/default';

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/auth/login/`;

type requestType = {
    phoneNumber: string,
    password: string
}

type responseType = {
    username: string,
    access_token: string,
    token_type: string
}

export const POST = async (request: NextRequest) => {
    const requestData: requestType = await request.json()
    const formData = new FormData();
    formData.append("username", requestData.phoneNumber)
    formData.append("password", requestData.password)
    try {
        const response = await axios.post<responseType>(EXTERNAL_API, formData)
        setToken(response.data.access_token)
        const jsonWebToken = jwt.decode(response.data.access_token)
        return NextResponse.json(jsonWebToken, {status: 200})
    } catch {
        return NextResponse.json({"login": false}, {status: 400})
    }
}
