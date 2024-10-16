"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/product-admin";


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
    imageUrls: string[]
}


const useAdminGetProductDetail = (productSerial: string) => {
    const {data, isPending, isError} = useQuery({
        queryKey: ["ProductDetail", productSerial],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<ProductType>(`${INTERNAL_API}/${productSerial}/`);
            return result.data;
        }
    })

    return {
        productData: data,
        productIsPending: isPending,
        productIsError: isError
    }
}

export default useAdminGetProductDetail;
