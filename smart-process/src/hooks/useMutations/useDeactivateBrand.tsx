"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/deactivate-brand/"


const useDeactivateBrand = () => {
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
        deactivateMutate: mutate
    }
};

export default useDeactivateBrand;
