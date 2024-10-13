"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/get-all-categories/";

export type CategoryType = {
    id: number,
    name: string,
    description: string,
    isActive: boolean,
    parentName?: string | null
}

type ResponseType = {
    count: number,
    items: CategoryType[]
}

type ParamsType = {
    page?: string | null
}


const useGetAllCategories = (params?: ParamsType) => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["AllCategories", params],
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
        categoriesCount: itemsCount,
        categoriesData: data,
        categoriesIsPending: isPending,
        categoriesIsError: isError
    }
}

export default useGetAllCategories;
