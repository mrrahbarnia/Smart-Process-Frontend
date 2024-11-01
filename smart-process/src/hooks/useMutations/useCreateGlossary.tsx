"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/create-glossary"

export type RequestType = {
    term: string,
    definition: string,
    articleId: string
}

export const useCreateGlossary = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({data}: {data: RequestType}) => {
            console.log(data);
            
            return axios.post(`${INTERNAL_API}/${data.articleId}/`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["Glossary"] })
        }
    })

    return {
        createIsPending: isPending,
        createMutateAsync: mutateAsync
    }
};
