"use client"
import { Suspense } from "react";
import ArticlesContainer from "@/components/admin/articles/ArticleContainer";

const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <ArticlesContainer />
        </Suspense>
    )
};

export default Page;