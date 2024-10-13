"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/unassign-attributes"

type RequestType = {
    attributeName: string,
    categoryId: number
};


const useUnassignCatAttr = () => {
    const client = useQueryClient();
    const {mutate, isSuccess} = useMutation({
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
        unassignMutate: mutate,
        isSuccess
    }
};

export default useUnassignCatAttr;
