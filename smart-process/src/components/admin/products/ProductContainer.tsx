"use client"
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { AiOutlinePlusCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import ProductList from "./ProductList";
import { Fragment, useState, useEffect } from "react";
// import CreateModal from "./CreateModal";
import useAdminGetAllProducts from "@/hooks/useQueries/useAdminGetAllProducts";

const ProductsContainer = () => {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const logout = useAuthStore((state) => state.logout);
    const [pageNumber, setPageNumber] = useState<string | null>();
    const searchParams = useSearchParams();
    const {
        productsCount,
        productsData,
        productsIsError,
        productsIsPending
    } = useAdminGetAllProducts({page: pageNumber});

    useEffect(() => {
        if (searchParams.get("page")) {
            setPageNumber(searchParams.get("page"));
        }
    }, [searchParams])

    if (productsIsError) {
        logout();
        return router.replace("/accounts/login/");
    }

    if (productsIsPending) {
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

    if (productsCount && (Number(searchParams.get("page")) ? Number(searchParams.get("page")) : 1 ) * 10 <= productsCount) {
        hasNextPage = true;
    } else {
        hasNextPage = false;
    }

    const previousHandler = () => {
        const url = `/admin/product/?page=${searchParams.get("page") ? Number(searchParams.get("page")) -1  : "1"}`
        return router.replace(url)
    };

    const nextHandler = () => {
        const url = `/admin/product/?page=${searchParams.get("page") ? Number(searchParams.get("page")) + 1  : "2"}`
        return router.replace(url);
    };

    return (
        <Fragment>

            {/* Create Modal */}
            {/* {showCreateModal && <CreateModal closeModalHandler={setShowCreateModal} />} */}

            <div className="w-full flex flex-col gap-4 min-h-screen px-2 md:px-6 min-[950px]:px-40 pt-16">
                <h1 className="text-center text-lg">مدیریت محصولات</h1>
                <div className="text-sm bg-blue-300 rounded-md py-1 px-4 flex items-center justify-between">
                    <div onClick={() => setShowCreateModal(true)} className="text-green-900 flex items-center gap-1 bg-green-200 cursor-pointer hover:bg-green-300 rounded-md px-2 py-1 transition-colors duration-300">
                        <AiOutlinePlusCircle size={20} />
                        <span>افزودن</span>
                    </div>
                    <span>تعداد محصولات: {productsCount}</span>
                </div>
                {productsData && <ProductList products={productsData}/>}


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

export default ProductsContainer;