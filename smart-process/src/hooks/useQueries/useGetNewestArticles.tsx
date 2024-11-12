"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/articles/newest-articles/`

export type NewestArticleType = {
    id: string,
    title: string,
    image: string
    createdAt: Date
}


const useGetNewestArticles = () => {
    const {data, isPending} = useQuery<NewestArticleType[]>({
        queryKey: ["NewestArticles"],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<NewestArticleType[]>(
                `${EXTERNAL_API}`
            );
            return result.data;
        },
    })

    return {
        newestArticlesData: data,
        newestArticlesIsPending: isPending,
    }
}

export default useGetNewestArticles;
