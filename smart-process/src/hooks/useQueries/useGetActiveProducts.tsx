"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/list-products/`;

export type ProductType = {
    id: string,
    name: string,
    serialNumber: string,
    stock: number,
    price: number,
    discount: number,
    categoryName: string,
    brandName: string,
    imageUrl: string,
    isActive: boolean,
    priceAfterDiscount: string
}

type ResponseType = {
    count: number,
    items: ProductType[]
}

export type ProductSearchParams = {
    page?: string | null,
    categoryExact?: string | null,
    brandExact?: string | null
    nameContain?: string | null
}


const useGetActiveProducts = (params?: ProductSearchParams) => {
    let itemsCount;
    const {data, isPending} = useQuery({
        queryKey: ["AllProducts", params],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<ResponseType>(EXTERNAL_API, { params: params });
            return result.data;
        },
        select: (result: ResponseType) => {
            itemsCount = result.count;
            return result.items;
        }
    })

    return {
        productsCount: itemsCount,
        productsData: data,
        productsIsPending: isPending
    }
}

export default useGetActiveProducts;
