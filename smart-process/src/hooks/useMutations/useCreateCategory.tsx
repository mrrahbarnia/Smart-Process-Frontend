"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/create-category/"

export type requestType = {
    name: string,
    description: string,
    parentCategoryName?: string | null
}

export const useCreateCategory = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({data}: {data: requestType}) => {
            return axios.post(`${INTERNAL_API}`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["AllCategories"] })
        }
    })

    return {
        createIsPending: isPending,
        createMutateAsync: mutateAsync
    }
};
