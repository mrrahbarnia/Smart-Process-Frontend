"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/assign-attributes"

type RequestType = {
    attributeName: string,
    categoryId: number
};


const useAssignCatAttr = () => {
    const client = useQueryClient();
    const {mutateAsync, isSuccess} = useMutation({
        mutationFn: (data: RequestType) => {
            return axios.post(`${INTERNAL_API}/`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["CategoryAttributes"]})
        }
    })

    return {
        assignMutateAsync: mutateAsync,
        isSuccess
    }
};

export default useAssignCatAttr;
