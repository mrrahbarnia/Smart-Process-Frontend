"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/update-brand"

export type requestType = {
    name: string,
    description: string
}

export const useUpdateBrand = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({slug, data}: {slug: string, data: requestType}) => {
            return axios.put(`${INTERNAL_API}/${slug}/`, data, {
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
        updateIsPending: isPending,
        updateMutateAsync: mutateAsync
    }
};
