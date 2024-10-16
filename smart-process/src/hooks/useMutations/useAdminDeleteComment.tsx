"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/delete-comment"

export const useAdminDeleteComment = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: ({id}: {id: number}) => {
            return axios.delete(`${INTERNAL_API}/${id}/`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["Comments"] })
        }
    })

    return {
        deleteMutate: mutate
    }
};
