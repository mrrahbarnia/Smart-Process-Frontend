"use server"
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getToken, deleteToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINT } from '@/configs/default';

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/admin/create-product/`;

type PayloadType = {
    discount?: string | null,
    categoryName: string,
    price: string,
    name: string,
    brandName: string,
    expiryDiscount?: string | null,
    stock: string,
    description: string,
    serialNumber: string,
    attributeValues?: Record<string, string>[]
}

export const POST = async (request: NextRequest) => {
    const data = await request.formData()

    const formData = new FormData;
    const priceNumber = (data.get("price") as string).replaceAll(",", "")

    const payload: PayloadType = {
        name: data.get("name") as string,
        serialNumber: data.get("serialNumber") as string,
        discount: data.get("discount") ? (data.get("discount") as string) : null,
        categoryName: data.get("categoryName") as string,
        brandName: data.get("brandName") as string,
        price: priceNumber,
        stock: data.get("stock") as string,
        description: data.get("description") as string,
    };
    if (data.get("expiryDiscount")) {
        payload.expiryDiscount = (data.get("expiryDiscount") as string)
    }
    if (data.get("attributeValues")) {
        payload.attributeValues = JSON.parse(data.get("attributeValues")as string) as Record<string, string>[]
    }
    formData.append("payload", JSON.stringify(payload))
    const images = Array.from(data.entries())
    .filter(([key, ]) => key === "images").map(([, value]) => value)
    images.forEach((image) => {
        formData.append("images", image)
    })

    try {
        const accessToken = await getToken();
        await axios.post(EXTERNAL_API, formData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        })
        return NextResponse.json({"created": true}, {status: 200})
    } catch (error) {
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
            if (error.response?.data && error.response?.data.detail === 'Could not validate credentials' ) {
                deleteToken();
                errorMessage = 'Could not validate credentials';
                return NextResponse.json({"message": errorMessage}, {status: 403})
            } else {
                return NextResponse.json({"detail": error.response?.data && error.response?.data.detail}, {status: 400})
            }
        } else {
            errorMessage = "Something went wrong";
            return NextResponse.json({"message": errorMessage}, {status: 400})
        }
    }
}
