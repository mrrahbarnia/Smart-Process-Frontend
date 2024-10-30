"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/delete-article-comment"

export const useAdminDeleteArticleComment = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: ({id}: {id: number}) => {
            return axios.delete(`${INTERNAL_API}/${id}/`, {
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
        deleteMutate: mutate
    }
};
