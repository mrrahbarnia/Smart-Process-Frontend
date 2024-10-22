"use client"
import { Suspense } from "react";
import ProductsContainer from "@/components/products/ProductContainer";

const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <ProductsContainer />
        </Suspense>
    )
};

export default Page;