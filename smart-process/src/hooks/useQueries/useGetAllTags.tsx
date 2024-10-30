"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/get-all-tags/";

export type TagType = {
    name: string
}

type ResponseType = {
    count: number,
    items: TagType[]
}

type ParamsType = {
    page?: string | null,
    nameContain?: string | null
}


const useGetAllTags = (params?: ParamsType) => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["AllTags", params],
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
        tagsCount: itemsCount,
        tagsData: data,
        tagsIsPending: isPending,
        tagsIsError: isError
    }
}

export default useGetAllTags;
