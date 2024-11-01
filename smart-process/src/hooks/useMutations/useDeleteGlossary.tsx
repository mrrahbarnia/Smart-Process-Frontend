"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/delete-glossary"

export const useDeleteGlossary = () => {
    const client = useQueryClient();
    const {mutateAsync} = useMutation({
        mutationFn: ({glossaryId}: {glossaryId: number}) => {
            return axios.delete(`${INTERNAL_API}/${glossaryId}/`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["Glossary"] })
        }
    })

    return {
        deleteMutateAsync: mutateAsync
    }
};
