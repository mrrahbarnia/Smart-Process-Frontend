"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/deactivate-category/"


const useDeactivateCategory = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: (id: number) => {
            return axios.put(`${INTERNAL_API}/${id}/`)
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["AllCategories"]})
        }
    })

    return {
        deactivateMutate: mutate
    }
};

export default useDeactivateCategory;