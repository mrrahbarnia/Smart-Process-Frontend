"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/articles/get-glossaries`

export type GlossaryType = {
    id: number,
    term: string,
    definition: string
}

type ParamsType = {
    articleId: string
}


const useGetGlossaries = (params: ParamsType, enabled: boolean) => {
    const {data, isPending} = useQuery({
        queryKey: ["Glossary", {article: params.articleId}],
        staleTime: 10000,
        enabled,
        queryFn: async function() {
            const result = await axios.get<GlossaryType[]>(
                `${EXTERNAL_API}/${params.articleId}/`
            );
            return result.data;
        },
    })

    return {
        glossariesData: data,
        glossariesIsPending: isPending,
    }
}

export default useGetGlossaries;
