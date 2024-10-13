"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/create-attribute/"

export type RequestType = {
    name: string
}

export const useCreateAttribute = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({data}: {data: RequestType}) => {
            return axios.post(`${INTERNAL_API}`, data, {
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
        createIsPending: isPending,
        createMutateAsync: mutateAsync
    }
};
