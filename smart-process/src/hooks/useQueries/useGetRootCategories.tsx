"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/root-categories/`

export type RootCategoriesType = {
    id: number,
    name: string
}


const useGetRootCategories = (enabled: boolean) => {
    const {data, isPending} = useQuery<RootCategoriesType[]>({
        queryKey: ["RootCategories"],
        staleTime: 10000,
        enabled,
        queryFn: async function() {
            const result = await axios.get<RootCategoriesType[]>(
                `${EXTERNAL_API}`
            );            
            return result.data;
        },
    })

    return {
        rootCategoriesData: data,
        rootCategoriesIsPending: isPending,
    }
}

export default useGetRootCategories;
