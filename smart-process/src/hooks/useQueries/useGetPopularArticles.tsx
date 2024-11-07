"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/articles/popular-articles/`

export type PopularArticleType = {
    id: string,
    title: string,
    image: string,
    averageRating: null | number
}


const useGetPopularArticles = () => {
    const {data, isPending} = useQuery<PopularArticleType[]>({
        queryKey: ["PopularArticles"],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<PopularArticleType[]>(
                `${EXTERNAL_API}`
            );            
            return result.data;
        },
    })

    return {
        popularArticlesData: data,
        popularArticlesIsPending: isPending,
    }
}

export default useGetPopularArticles;
