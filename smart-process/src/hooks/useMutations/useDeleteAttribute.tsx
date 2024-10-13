"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/delete-attribute"

export const useDeleteAttribute = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({name}: {name: string}) => {
            return axios.delete(`${INTERNAL_API}/${name}/`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["AllAttributes"] })
        }
    })

    return {
        deleteIsPending: isPending,
        deleteMutateAsync: mutateAsync
    }
};
