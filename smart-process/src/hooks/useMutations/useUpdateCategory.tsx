"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/update-category"

export type requestType = {
    name: string,
    description: string,
    parentCategoryName?: string | null
}

export const useUpdateCategory = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({id, data}: {id: number, data: requestType}) => {
            return axios.put(`${INTERNAL_API}/${id}/`, data, {
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
        updateIsPending: isPending,
        updateMutateAsync: mutateAsync
    }
};
