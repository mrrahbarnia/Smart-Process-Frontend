"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/get-all-categories/";

export type categoryType = {
    id: number,
    name: string,
    description: string,
    is_active: boolean,
    parentName?: string | null
}

type responseType = {
    count: number,
    items: categoryType[]
}


const useGetAllCategories = () => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["AllCategories"],
        queryFn: async function() {
            const result = await axios.get<responseType>(INTERNAL_API);
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
