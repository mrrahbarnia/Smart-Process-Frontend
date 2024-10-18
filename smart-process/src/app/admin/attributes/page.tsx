"use client"
import { Suspense } from "react";
import AttributesContainer from "@/components/admin/attributes/AttributesContainer";

const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <AttributesContainer />
        </Suspense>
    )
};

export default Page;