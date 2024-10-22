"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/active-brands/`

export type BrandType = {
    slug: string,
    name: string,
    description: string,
}


const useGetActiveBrands = () => {
    const {data, isPending} = useQuery({
        queryKey: ["ActiveBrands"],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<BrandType[]>(EXTERNAL_API);
            return result.data;
        }
    })

    return {
        brandsData: data,
        brandsIsPending: isPending,
    }
}

export default useGetActiveBrands;
