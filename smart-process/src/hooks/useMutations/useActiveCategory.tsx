"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/activate-category/"


const useActivateCategory = () => {
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
        activateMutate: mutate
    }
};

export default useActivateCategory;