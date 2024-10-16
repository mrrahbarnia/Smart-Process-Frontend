"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/get-all-admin-products/";

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
    isActive: boolean
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


const useAdminGetAllProducts = (params?: ProductSearchParams) => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["AllProducts", params],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<ResponseType>(INTERNAL_API, { params: params });
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
        productsIsPending: isPending,
        productsIsError: isError
    }
}

export default useAdminGetAllProducts;
