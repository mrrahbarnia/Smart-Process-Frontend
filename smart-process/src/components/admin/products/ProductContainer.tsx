"use client"
import axios from "axios";
import { FcSearch } from "react-icons/fc";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { AiOutlinePlusCircle, AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductList from "./ProductList";
import { Fragment, useState, useEffect } from "react";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import useDebounced from "@/hooks/useDebounced";
import { useForm, SubmitHandler } from "react-hook-form";
import { ProductSearchParams } from "@/hooks/useQueries/useAdminGetAllProducts";
import useAdminGetAllProducts from "@/hooks/useQueries/useAdminGetAllProducts";

const EXTERNAL_CATEGORY_SEARCH = `${EXTERNAL_BASE_ENDPOINT}/products/search-categories`
const EXTERNAL_BRAND_SEARCH = `${EXTERNAL_BASE_ENDPOINT}/products/search-brands`

type InputTypes = {
    categoryExact?: string | null,
    brandExact?: string | null,
    nameContain?: string | null
}

const ProductsContainer = () => {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const [showSearchMenu, setShowSearchMenu] = useState<boolean>(false);
    const [brandValue, setBrandValue] = useState<string>("");
    const [openSuggestedBrandValue, setOpenSuggestedBrandValue] = useState<boolean>(false);
    const [suggestedBrands, setSuggestedBrands] = useState<string[]>([]);
    const [brandIsLoading, setBrandIsLoading] = useState<boolean>(false);
    const debounceBrandValue = useDebounced(brandValue);
    const [categoryValue, setCategoryValue] = useState<string>("");
    const [openSuggestedCategoryValue, setOpenSuggestedCategoryValue] = useState<boolean>(false);
    const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
    const [categoryIsLoading, setCategoryIsLoading] = useState<boolean>(false);
    const debounceCategoryValue = useDebounced(categoryValue);
    const searchParams = useSearchParams();
    const [searchFilterParams, setSearchFilterParams] = useState<ProductSearchParams>()
    const {
        productsCount,
        productsData,
        productsIsError,
        productsIsPending
    } = useAdminGetAllProducts(searchFilterParams);
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm<InputTypes>()

    useEffect(() => {
        setSearchFilterParams({
            "brandExact": searchParams.get("brandExact"),
            "categoryExact": searchParams.get("categoryExact"),
            "nameContain": searchParams.get("nameContain"),
            "page": searchParams.get("page")
        })
    }, [searchParams])

    useEffect(() => {
        if (categoryValue) {
            setCategoryIsLoading(true);
        }
    }, [categoryValue]);

    useEffect(() => {
        if (brandValue) {
            setBrandIsLoading(true);
        }
    }, [brandValue])

    useEffect(() => {
        if (debounceCategoryValue) {
            axios.get<string[]>(`${EXTERNAL_CATEGORY_SEARCH}/?category_name=${debounceCategoryValue}`)
            .then((response) => setSuggestedCategories(response.data))
            setCategoryIsLoading(false);
        }
    }, [debounceCategoryValue])

    useEffect(() => {
        if (debounceBrandValue) {
            axios.get<string[]>(`${EXTERNAL_BRAND_SEARCH}/?brand_name=${debounceBrandValue}`)
            .then((response) => setSuggestedBrands(response.data))
            setBrandIsLoading(false);
        }
    }, [debounceBrandValue])

    if (productsIsError) {
        logout();
        router.replace("/accounts/login/");
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

    const onSubmit: SubmitHandler<InputTypes> = async(data) => {
        const url = `/admin/products/?nameContain=${data.nameContain}&brandExact=${data.brandExact}&categoryExact=${data.categoryExact}`;
        setShowSearchMenu(false);
        return router.replace(url);
    }

    const previousHandler = () => {
        const url = `/admin/products/?page=${searchParams.get("page") ? Number(searchParams.get("page")) -1  : "1"}${searchParams.get("nameContain") ? `&nameContain=${searchParams.get("nameContain")}` : ""}${searchParams.get("brandExact") ? `&brandExact=${searchParams.get("brandExact")}` : ""}${searchParams.get("categoryExact") ? `&categoryExact=${searchParams.get("categoryExact")}` : ""}`
        return router.replace(url)
    };

    const nextHandler = () => {
        const url = `/admin/products/?page=${searchParams.get("page") ? Number(searchParams.get("page")) + 1  : "2"}${searchParams.get("nameContain") ? `&nameContain=${searchParams.get("nameContain")}` : ""}${searchParams.get("brandExact") ? `&brandExact=${searchParams.get("brandExact")}` : ""}${searchParams.get("categoryExact") ? `&categoryExact=${searchParams.get("categoryExact")}` : ""}`
        return router.replace(url);
    };

    const brandChangeHandler = (e: string) => {
        setBrandValue(e);
        if (e.length >= 2) {
            setOpenSuggestedBrandValue(true);
        } else {
            setOpenSuggestedBrandValue(false);
        }
    };

    const categoryChangeHandler = (e: string) => {
        setCategoryValue(e);
        if (e.length >= 2) {
            setOpenSuggestedCategoryValue(true);
        } else {
            setOpenSuggestedCategoryValue(false);
        }
    };

    return (
        <Fragment>

            <div className="w-full flex flex-col gap-4 min-h-screen px-2 md:px-6 min-[950px]:px-40 pt-16">
                <h1 className="text-center text-lg">مدیریت محصولات</h1>
                <div className="text-sm bg-blue-300 rounded-md py-1 px-4 flex items-center justify-between">
                    <Link href="/admin/products/create/" className="text-green-900 flex items-center gap-1 bg-green-200 cursor-pointer hover:bg-green-300 rounded-md px-2 py-1 transition-colors duration-300">
                        <AiOutlinePlusCircle size={20} />
                        <span>افزودن</span>
                    </Link>
                    <span>تعداد محصولات: {productsCount}</span>
                </div>
                <div onClick={() => setShowSearchMenu(true)} className="cursor-pointer flex items-center gap-1 bg-blue-100 rounded-md w-fit p-1 text-blue-900 hover:bg-blue-200 transition-colors duration-300">
                    <FcSearch />
                    <span>فیلتر پیشرفته</span>
                </div>
                <div className={`z-50 fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-2/5 transform transition-transform bg-gradient-to-l from-blue-50 to-blue-200 duration-500 ${showSearchMenu ? "translate-x-0" : "translate-x-full"}`}>
                    <button className="absolute right-2 top-2 hover:text-red-600" onClick={() => setShowSearchMenu(false)}>X</button>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-2/3 mx-auto pt-24">
                        <div className="flex flex-col text-sm gap-1">
                            <label>مدل محصول</label>
                            <input className="h-10 rounded-md border-blue-100 px-2" dir="ltr" {...register("nameContain")} />
                        </div>
                        <div className="flex flex-col text-sm gap-1">
                            <label>دسته بندی</label>
                            <input className="h-10 rounded-md border-blue-100 px-2" {...register("categoryExact", {
                                onChange: (e) => categoryChangeHandler(e.target.value)
                            })} />
                            {!openSuggestedCategoryValue && <div className="text-xs flex items-center gap-1 bg-yellow-400 rounded-md p-1">
                                <AiOutlineWarning size={20} />
                                <p>دسته بندی وارد شده حتما باید از موارد پیشنهاد شده باشد.</p>
                            </div>}
                            {openSuggestedCategoryValue  && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2 text-sm">
                                {categoryIsLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : suggestedCategories.length <= 0 ? <p className="text-red-600">دسته بندی یافت نشد</p> : suggestedCategories.map(category => <li onClick={() => {
                                    setValue("categoryExact", category);
                                    setOpenSuggestedCategoryValue(false);
                                }} className="cursor-pointer overflow-hidden hover:bg-gray-100 rounded-md px-2 py-1 transition-colors duration-300" key={category}>{category}</li>)}
                            </ul>}
                        </div>
                        <div className="flex flex-col text-sm gap-1">
                            <label>برند</label>
                            <input className="h-10 rounded-md border-blue-100 px-2" dir="ltr" {...register("brandExact", {
                                onChange: (e) => brandChangeHandler(e.target.value)
                            })} />
                            {!openSuggestedBrandValue && <div className="text-xs flex items-center gap-1 bg-yellow-400 rounded-md p-1">
                                <AiOutlineWarning size={20} />
                                <p>برند وارد شده حتما باید از موارد پیشنهاد شده باشد.</p>
                            </div>}
                            {openSuggestedBrandValue  && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2 text-sm">
                                {brandIsLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : suggestedBrands.length <= 0 ? <p className="text-red-600">برندی یافت نشد</p> : suggestedBrands.map(brand => <li onClick={() => {
                                    setValue("brandExact", brand);
                                    setOpenSuggestedBrandValue(false);
                                }} className="cursor-pointer overflow-hidden hover:bg-gray-100 rounded-md px-2 py-1 transition-colors duration-300" key={brand}>{brand}</li>)}
                            </ul>}
                        </div>
                        <button className="bg-blue-100 rounded-md p-1 text-blue-900 hover:bg-blue-200 transition-colors duration-300">جستجو</button>
                    </form>
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
            {showSearchMenu && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
        </Fragment>
    )
};

export default ProductsContainer;