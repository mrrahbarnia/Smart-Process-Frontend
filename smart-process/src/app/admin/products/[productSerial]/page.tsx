"use client"
import ProductDetailContainer from "@/components/admin/products/detail/ProductDetailContainer";

const Page = ({params}: {params: {productSerial: string}}) => {
    return (
        <ProductDetailContainer productSerial={params.productSerial}/>
    )
};

export default Page;