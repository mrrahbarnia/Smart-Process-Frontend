"use client"
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { AiOutlinePlusCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
// import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import ArticleList from "./ArticleList";
import { useState, useEffect } from "react";
import Link from "next/link";
import useGetAllArticles from "@/hooks/useQueries/useGetAllArticles";

type ArticleSearchType = {
    page?: string | null,
    tag_name?: string | null
}

const ArticlesContainer = () => {
    const router = useRouter();
    // const logout = useAuthStore((state) => state.logout);
    const searchParams = useSearchParams();
    const [searchFilterParams, setSearchFilterParams] = useState<ArticleSearchType>();
    const {
        articlesCount,
        articlesData,
        // articlesIsError,
        articlesIsPending
    } = useGetAllArticles(searchFilterParams);

    useEffect(() => {
        setSearchFilterParams({
            "page": searchParams.get("page"),
            "tag_name": searchParams.get("tag_name")
        })
    }, [searchParams])

    // if (tagsIsError) {
    //     logout();
    //     router.replace("/accounts/login/");
    // }

    if (articlesIsPending) {
        return <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-12 h-12 m-auto" />
    }

    let hasPreviousPage;
    let hasNextPage;

    if (searchParams.get("page")) {
        if (searchParams.get("page") === "1") {
            hasPreviousPage = false;
        } else {
            hasPreviousPage = true;
        }
    } else {
        hasPreviousPage = false;
    }

    if (articlesCount && (Number(searchParams.get("page")) ? Number(searchParams.get("page")) : 1 ) * 10 < articlesCount) {
        hasNextPage = true;
    } else {
        hasNextPage = false;
    }

    const previousHandler = () => {
        const url = `/admin/articles/?page=${searchParams.get("page") ? Number(searchParams.get("page")) -1  : "1"}`
        return router.replace(url)
    };

    const nextHandler = () => {
        const url = `/admin/articles/?page=${searchParams.get("page") ? Number(searchParams.get("page")) + 1  : "2"}`
        return router.replace(url);
    };

    return (
        <div className="w-full flex flex-col gap-4 min-h-screen px-2 md:px-6 min-[950px]:px-40 pt-16">
            <h1 className="text-center text-lg">مدیریت مقالات</h1>
            <div className="text-sm bg-blue-300 rounded-md py-1 px-4 flex items-center justify-between">
                <Link href="/admin/articles/create/" className="text-green-900 flex items-center gap-1 bg-green-200 cursor-pointer hover:bg-green-300 rounded-md px-2 py-1 transition-colors duration-300">
                    <AiOutlinePlusCircle size={20} />
                    <span>افزودن</span>
                </Link>
                <span>تعداد مقالات: {articlesCount}</span>
            </div>
            {articlesData && <ArticleList articles={articlesData}/>}

                {/* Pagination */}
                <div className="flex items-center gap-4 mx-auto pt-8">
                    {
                        hasNextPage && 
                        <button onClick={nextHandler} className="flex items-center bg-blue-50 text-blue-800 transition-colors duration-300 hover:bg-blue-200 rounded-md p-1" type="button">
                            <GrFormNext />
                            <span>صفحه بعد</span>
                        </button>
                    }

                    {
                        hasPreviousPage && 
                        <button onClick={previousHandler} className="flex items-center bg-blue-50 text-blue-800 transition-colors duration-300 hover:bg-blue-200 rounded-md p-1" type="button">
                            <span>صفحه قبل</span>
                            <GrFormPrevious />
                        </button>
                    }
                </div>

        </div>
    )
};

export default ArticlesContainer;