"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/get-all-brands/";

export type BrandType = {
    slug: string,
    name: string,
    description: string,
    isActive: boolean,
}

type ResponseType = {
    count: number,
    items: BrandType[]
}

type ParamsType = {
    page?: string | null
}


const useGetAllBrands = (params?: ParamsType) => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["AllBrands", params],
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
        brandsCount: itemsCount,
        brandsData: data,
        brandsIsPending: isPending,
        brandsIsError: isError
    }
}

export default useGetAllBrands;
