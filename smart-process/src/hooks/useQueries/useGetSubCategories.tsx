"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/sub-categories`

export type SubCategoriesType = {
    id: number,
    name: string
}


const useGetSubCategories = ({categoryId, enabled, layer}: {categoryId: number, enabled: boolean, layer: "Second" | "Third"}) => {
    const {data, isLoading} = useQuery<SubCategoriesType[]>({
        queryKey: layer === "Second" ? ["SubCategories", categoryId] : ["ThirdLayerCategories", categoryId],
        staleTime: 10000,
        enabled,
        queryFn: async function() {
            const result = await axios.get<SubCategoriesType[]>(
                `${EXTERNAL_API}/${categoryId}/`
            );
            return result.data;
        },
    })

    return {
        subCategoriesData: data,
        subCategoriesIsPending: isLoading,
    }
}

export default useGetSubCategories;
