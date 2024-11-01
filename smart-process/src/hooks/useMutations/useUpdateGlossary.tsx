"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INTERNAL_API = "/apis/admin/update-glossary"

export type requestType = {
    term: string,
    definition: string
}

export const useUpdateGlossary = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: ({glossaryId, data}: {glossaryId: number, data: requestType}) => {
            return axios.put(`${INTERNAL_API}/${glossaryId}/`, data, {
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
        updateIsPending: isPending,
        updateMutateAsync: mutateAsync
    }
};
