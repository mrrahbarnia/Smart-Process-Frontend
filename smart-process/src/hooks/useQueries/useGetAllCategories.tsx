"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/get-all-categories/";

export type categoryType = {
    id: number,
    name: string,
    description: string,
    isActive: boolean,
    parentName?: string | null
}

type responseType = {
    count: number,
    items: categoryType[]
}

type paramsType = {
    page?: string | null
}


const useGetAllCategories = (params?: paramsType) => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["AllCategories", params],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<responseType>(INTERNAL_API, { params: params });
            return result.data;
        },
        select: (result: responseType) => {
            itemsCount = result.count;
            return result.items;
        }
    })

    return {
        categoriesCount: itemsCount,
        categoriesData: data,
        categoriesIsPending: isPending,
        categoriesIsError: isError
    }
}

export default useGetAllCategories;
