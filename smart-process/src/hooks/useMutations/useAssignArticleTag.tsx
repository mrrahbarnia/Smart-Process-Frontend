"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/assign-tags"

type RequestType = {
    tagName: string,
    articleId: string
};


const useAssignArticleTag = () => {
    const client = useQueryClient();
    const {mutateAsync, isSuccess, isPending} = useMutation({
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
        assignMutateAsync: mutateAsync,
        isSuccess,
        isPending
    }
};

export default useAssignArticleTag;
