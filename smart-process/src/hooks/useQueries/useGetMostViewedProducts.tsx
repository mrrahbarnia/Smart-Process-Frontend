"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/most-viewed/`

export type MostViewedProductType = {
    serialNumber: string,
    name: string,
    image: string,
    views: number
}


const useGetMostViewedProducts = () => {
    const {data, isPending} = useQuery<MostViewedProductType[]>({
        queryKey: ["MostViewedProducts"],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<MostViewedProductType[]>(
                `${EXTERNAL_API}`
            );            
            return result.data;
        },
    })

    return {
        mostViewedProductsData: data,
        mostViewedProductsIsPending: isPending,
    }
}

export default useGetMostViewedProducts;
