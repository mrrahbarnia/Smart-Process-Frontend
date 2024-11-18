"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/newest/`

export type NewestProductType = {
    serialNumber: string,
    name: string,
    image: string
    createdAt: Date
}


const useGetNewestProducts = () => {
    const {data, isPending} = useQuery<NewestProductType[]>({
        queryKey: ["NewestProducts"],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<NewestProductType[]>(
                `${EXTERNAL_API}`
            );
            return result.data;
        },
    })

    return {
        newestProductsData: data,
        newestProductsIsPending: isPending,
    }
}

export default useGetNewestProducts;
