"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/update-tag"

export type RequestType = {
    name: string
}

export const useUpdateTag = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({name, data}: {name: string, data: RequestType}) => {
            return axios.put(`${INTERNAL_API}/${name}/`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["AllTags"] })
        }
    })

    return {
        updateIsPending: isPending,
        updateMutateAsync: mutateAsync
    }
};
