"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/articles/list-articles/`;

export type ArticleType = {
    id: string,
    title: string,
    image: string,
    description: string,
    tags: (string | null)[],
    averageRating: number | null,
    createdAt: Date
}

type ResponseType = {
    count: number,
    items: ArticleType[]
}

type ParamsType = {
    page?: string | null,
    tag_name?: string | null
}


const useGetAllArticles = (params?: ParamsType) => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["Articles", params],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<ResponseType>(EXTERNAL_API, { params: params });
            return result.data;
        },
        select: (result: ResponseType) => {
            itemsCount = result.count;
            return result.items;
        }
    })

    return {
        articlesCount: itemsCount,
        articlesData: data,
        articlesIsPending: isPending,
        articlesIsError: isError
    }
}

export default useGetAllArticles;
