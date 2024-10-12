"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/activate-brand/"


const useActivateBrand = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: (slug: string) => {
            return axios.put(`${INTERNAL_API}/${slug}/`)
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["AllBrands"]})
        }
    })

    return {
        activateMutate: mutate
    }
};

export default useActivateBrand;