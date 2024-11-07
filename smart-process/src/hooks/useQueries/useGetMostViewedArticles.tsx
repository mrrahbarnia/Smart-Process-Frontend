"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/articles/most-viewed-articles/`

export type MostViewedArticleType = {
    id: string,
    title: string,
    image: string,
    views: number
}


const useGetMostViewedArticles = () => {
    const {data, isPending} = useQuery<MostViewedArticleType[]>({
        queryKey: ["MostViewedArticles"],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<MostViewedArticleType[]>(
                `${EXTERNAL_API}`
            );            
            return result.data;
        },
    })

    return {
        mostViewedArticlesData: data,
        mostViewedArticlesIsPending: isPending,
    }
}

export default useGetMostViewedArticles;
