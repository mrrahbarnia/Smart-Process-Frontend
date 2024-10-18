"use client"
import { Suspense } from "react";
import BrandsContainer from "@/components/admin/brands/BrandsContainer";

const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <BrandsContainer />
        </Suspense>
    )
};

export default Page;