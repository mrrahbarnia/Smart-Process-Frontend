"use client"
import { Suspense } from "react";
import TagsContainer from "@/components/admin/tags/TagContainer";

const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <TagsContainer />
        </Suspense>
    )
};

export default Page;