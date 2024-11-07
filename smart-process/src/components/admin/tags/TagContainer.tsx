"use client"
import { FcSearch } from "react-icons/fc";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { AiOutlinePlusCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import TagList from "./TagList";
import { Fragment, useState, useEffect } from "react";
import { useRef } from "react";
import CreateModal from "./CreateModal";
import useGetAllTags from "@/hooks/useQueries/useGetAllTags";

type TagSearchType = {
    page?: string | null,
    nameContain?: string | null
}

const TagsContainer = () => {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const logout = useAuthStore((state) => state.logout);
    const searchParams = useSearchParams();
    const [searchFilterParams, setSearchFilterParams] = useState<TagSearchType>();
    const ref = useRef<HTMLInputElement>(null);
    const {
        tagsCount,
        tagsData,
        tagsIsError,
        tagsIsPending
    } = useGetAllTags(searchFilterParams);

    useEffect(() => {
        setSearchFilterParams({
            "page": searchParams.get("page"),
            "nameContain": searchParams.get("nameContain")
        })
    }, [searchParams])

    if (tagsIsError) {
        logout();
        router.replace("/accounts/login/");
    }

    if (tagsIsPending) {
        return <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-12 h-12 m-auto" />
    }

    const searchClickHandler = () => {
        if (ref.current) {
            const url = `/admin/tags?page=1&nameContain=${ref.current.value}`
            return router.replace(url)
        }
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

    if (tagsCount && (Number(searchParams.get("page")) ? Number(searchParams.get("page")) : 1 ) * 10 < tagsCount) {
        hasNextPage = true;
    } else {
        hasNextPage = false;
    }

    const previousHandler = () => {
        const url = `/admin/tags/?page=${searchParams.get("page") ? Number(searchParams.get("page")) -1  : "1"}${searchParams.get("nameContain") ? `&nameContain=${searchParams.get("nameContain")}` : ""}`
        return router.replace(url)
    };

    const nextHandler = () => {
        const url = `/admin/tags/?page=${searchParams.get("page") ? Number(searchParams.get("page")) + 1  : "2"}${searchParams.get("nameContain") ? `&nameContain=${searchParams.get("nameContain")}` : ""}`
        return router.replace(url);
    };

    return (
        <Fragment>

            {/* Create Modal */}
            {showCreateModal && <CreateModal closeModalHandler={setShowCreateModal} />}

            <div className="w-full flex flex-col gap-4 min-h-screen px-2 md:px-6 min-[950px]:px-40 pt-16">
                <h1 className="text-center text-lg text-blue-900 font-[YekanBakh-Black]">مدیریت تگ ها</h1>
                <div className="text-sm bg-blue-300 rounded-md py-1 px-4 flex items-center justify-between">
                    <div onClick={() => setShowCreateModal(true)} className="text-green-900 flex items-center gap-1 bg-green-200 cursor-pointer hover:bg-green-300 rounded-md px-2 py-1 transition-colors duration-300">
                        <AiOutlinePlusCircle size={20} />
                        <span>افزودن</span>
                    </div>
                    <span>تعداد تگ ها: {tagsCount}</span>
                </div>
                <div className="relative mx-auto ">
                    <input ref={ref} type="text" className="border-blue-300 border-2 rounded-md h-8 px-1 text-sm" />
                    <FcSearch onClick={searchClickHandler} size={20} className="cursor-pointer z-10 absolute left-2 top-1" />
                </div>
                {tagsData && <TagList tags={tagsData}/>}


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
            {showCreateModal && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
        </Fragment>
    )
};

export default TagsContainer;