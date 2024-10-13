"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/list-assigned-attributes";

type ParamsType = {
    categoryId: number
}

const useGetCatAttributes = (params: ParamsType) => {
    const {data, isPending} = useQuery({
        queryKey: ["CategoryAttributes", params],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<string[]>(`${INTERNAL_API}/${params.categoryId}/`);
            return result.data;
        }
    })

    return {
        catAttributesData: data,
        catAttributesIsPending: isPending
    }
}

export default useGetCatAttributes;
