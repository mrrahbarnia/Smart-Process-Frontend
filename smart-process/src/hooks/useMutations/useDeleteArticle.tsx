"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/delete-article"

export const useDeleteArticle = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({id}: {id: string}) => {
            return axios.delete(`${INTERNAL_API}/${id}/`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["Articles"] })
        }
    })

    return {
        deleteIsPending: isPending,
        deleteMutateAsync: mutateAsync
    }
};
