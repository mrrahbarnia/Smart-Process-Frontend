"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/create-product/"

export const useCreateProduct = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (data: FormData) => {
            return axios.post(`${INTERNAL_API}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["AllProducts"] })
        }
    })

    return {
        createIsPending: isPending,
        createMutateAsync: mutateAsync
    }
};
