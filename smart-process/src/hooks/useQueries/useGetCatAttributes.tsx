"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/list-assigned-attributes";

type ParamsType = {
    categoryName: string
}

const useGetCatAttributes = (params: ParamsType, enabled: boolean = true) => {
    const {data, isPending} = useQuery({
        queryKey: ["CategoryAttributes", params],
        staleTime: 10000,
        enabled,
        queryFn: async function() {
            const result = await axios.get<string[]>(`${INTERNAL_API}/${params.categoryName}/`);
            return result.data;
        }
    })

    return {
        catAttributesData: data,
        catAttributesIsPending: isPending
    }
}

export default useGetCatAttributes;
