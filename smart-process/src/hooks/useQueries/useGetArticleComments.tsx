"use client"
import axios from "axios";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { useQuery } from "@tanstack/react-query";

export type CommentType = {
    message: string,
    id: number,
    username: string,
    createdAt: Date,
}


const useGetArticleComments = (articleId: string, enabled: boolean) => {
    const {data, isPending} = useQuery({
        queryKey: ["ArticleComments", {article: articleId}],
        staleTime: 10000,
        enabled,
        queryFn: async function() {
            const result = await axios.get<CommentType[]>(`${EXTERNAL_BASE_ENDPOINT}/articles/list-article-comments/${articleId}/`);
            return result.data;
        }
    })

    return {
        commentsData: data,
        commentsIsPending: isPending,
    }
}

export default useGetArticleComments;
