"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/product-detail`


export type ProductType = {
    id: string,
    name: string,
    serialNumber: string,
    stock: number,
    price: number,
    description: string,
    discount: number,
    expiryDiscount: string,
    categoryName: string,
    brandName: string,
    isActive: boolean
    attributeValues: Record<string, string>,
    imageUrls: string[],
    priceAfterDiscount: string
}


const useGetProductDetail = (productSerial: string) => {
    const {data, isPending, isError} = useQuery({
        queryKey: ["ActiveProductDetail", productSerial],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<ProductType>(`${EXTERNAL_API}/${productSerial}/`);
            return result.data;
        }
    })

    return {
        productData: data,
        productIsPending: isPending,
        productIsError: isError
    }
}

export default useGetProductDetail;
