"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/deactivate-product/"


const useDeactivateProduct = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: (id: string) => {
            return axios.put(`${INTERNAL_API}/${id}/`)
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["AllProducts"]})
            client.invalidateQueries({queryKey: ["ProductDetail"]})
        }
    })

    return {
        deactivateMutate: mutate
    }
};

export default useDeactivateProduct;