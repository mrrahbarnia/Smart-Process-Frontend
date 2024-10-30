"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/unassign-tags"

type RequestType = {
    articleId: string,
    tagName: string
};


const useUnassignTags = () => {
    const client = useQueryClient();
    const {mutateAsync} = useMutation({
        mutationFn: (data: RequestType) => {
            return axios.post(`${INTERNAL_API}/`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["Articles"]})
        }
    })

    return {
        unassignMutateAsync: mutateAsync,
    }
};

export default useUnassignTags;
