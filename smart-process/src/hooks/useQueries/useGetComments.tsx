"use client"
import axios from "axios";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { useQuery } from "@tanstack/react-query";

export type CommentType = {
    message: string,
    id: number,
    username: string,
    createdAt: Date,
}


const useGetComments = (productId: string, enabled: boolean) => {
    const {data, isPending} = useQuery({
        queryKey: ["Comments", {product: productId}],
        staleTime: 10000,
        enabled,
        queryFn: async function() {
            const result = await axios.get<CommentType[]>(`${EXTERNAL_BASE_ENDPOINT}/products/list-comments/${productId}/`);
            return result.data;
        }
    })

    return {
        commentsData: data,
        commentsIsPending: isPending,
    }
}

export default useGetComments;
