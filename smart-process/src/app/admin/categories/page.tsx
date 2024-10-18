"use client"
import { Suspense } from "react";
import CategoryContainer from "@/components/admin/categories/CategoriesContainer";

const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <CategoryContainer />
        </Suspense>
    )
};

export default Page;