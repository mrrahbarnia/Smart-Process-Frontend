"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/delete-brand"

export const useDeleteBrand = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({slug}: {slug: string}) => {
            return axios.delete(`${INTERNAL_API}/${slug}/`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["AllBrands"] })
        }
    })

    return {
        deleteIsPending: isPending,
        deleteMutateAsync: mutateAsync
    }
};
