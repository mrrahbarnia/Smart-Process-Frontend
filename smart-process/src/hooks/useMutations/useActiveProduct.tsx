"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/activate-product/"


const useActivateProduct = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: (id: string) => {
            return axios.put(`${INTERNAL_API}/${id}/`)
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["AllProducts"]})
        }
    })

    return {
        activateMutate: mutate
    }
};

export default useActivateProduct;