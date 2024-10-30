"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/get-all-attributes/";

export type AttributeType = {
    name: string
}

type ResponseType = {
    count: number,
    items: AttributeType[]
}

type ParamsType = {
    page?: string | null,
    nameContain?: string | null
}


const useGetAllAttributes = (params?: ParamsType) => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["AllAttributes", params],
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
        attributesCount: itemsCount,
        attributesData: data,
        attributesIsPending: isPending,
        attributesIsError: isError
    }
}

export default useGetAllAttributes;
