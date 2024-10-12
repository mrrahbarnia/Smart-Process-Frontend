"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/delete-category"

export const useDeleteCategory = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({id}: {id: number}) => {
            return axios.delete(`${INTERNAL_API}/${id}/`, {
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
        deleteIsPending: isPending,
        deleteMutateAsync: mutateAsync
    }
};
