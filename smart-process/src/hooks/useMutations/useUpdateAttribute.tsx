"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/update-attribute"

export type RequestType = {
    name: string
}

export const useUpdateAttribute = () => {
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
            client.invalidateQueries({ queryKey: ["AllAttributes"] })
        }
    })

    return {
        updateIsPending: isPending,
        updateMutateAsync: mutateAsync
    }
};
