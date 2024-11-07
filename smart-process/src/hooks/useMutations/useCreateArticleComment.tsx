"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/create-article-comment/"

type RequestParams = {
    articleId: string,
    message: string
}

export const useCreateArticleComment = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending, isSuccess} = useMutation({
        mutationFn: (data: RequestParams) => {
            return axios.post(`${INTERNAL_API}/${data.articleId}/`, {message: data.message}, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["ArticleComments"] })
        }
    })

    return {
        createIsSuccess: isSuccess,
        createIsPending: isPending,
        createMutateAsync: mutateAsync
    }
};
