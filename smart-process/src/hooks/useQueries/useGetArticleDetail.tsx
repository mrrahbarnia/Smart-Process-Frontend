"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/article-detail";


export type ArticleDetailType = {
    id: string,
    title: string,
    description: string,
    tags: (string | null)[],
    images: string[],
    averageRating: number | null,
    views: number,
    createdAt: Date
}


const useGetArticleDetail = (articleId: string) => {
    const {data, isPending, isError} = useQuery({
        queryKey: ["Articles", articleId],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<ArticleDetailType>(`${INTERNAL_API}/${articleId}/`);
            console.log(result.data);
            
            return result.data;
        }
    })

    return {
        articleData: data,
        articleIsPending: isPending,
        articleIsError: isError
    }
}

export default useGetArticleDetail;
