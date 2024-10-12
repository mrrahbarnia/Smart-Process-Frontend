"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/create-brand/"

export type requestType = {
    name: string,
    description: string
}

export const useCreateBrand = () => {
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
            client.invalidateQueries({ queryKey: ["AllBrands"] })
        }
    })

    return {
        createIsPending: isPending,
        createMutateAsync: mutateAsync
    }
};
