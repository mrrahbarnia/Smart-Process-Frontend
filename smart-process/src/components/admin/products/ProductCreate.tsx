"use client"
import axios from "axios";
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import useGetCatAttributes from "@/hooks/useQueries/useGetCatAttributes";
// import { useAuthStore } from "@/store/useAuthStore";
import useDebounced from "@/hooks/useDebounced";
import DatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";

const EXTERNAL_CATEGORY_SEARCH = `${EXTERNAL_BASE_ENDPOINT}/products/search-categories`
const EXTERNAL_BRAND_SEARCH = `${EXTERNAL_BASE_ENDPOINT}/products/search-brands`

type InputTypes = {
    discount: number,
    categoryName: string,
    price: string,
    name: string,
    brandName: string,
    expiryDiscount: string,
    stock: number,
    description: string,
    serialNumber: string,
    attributeValues: Record<string, string>[]
}


const ProductCreate = () => {
    const [openSuggestedBrandMenu, setOpenSuggestedBrandMenu] = useState<boolean>(false);
    const [suggestedBrands, setSuggestedBrands] = useState<string[]>([]);
    const [brandIsLoading, setBrandIsLoading] = useState<boolean>(false);
    const [brandValue, setBrandValue] = useState<string>("");
    const debounceBrandValue = useDebounced(brandValue);
    const [categoryValue, setCategoryValue] = useState<string>("");
    const [openSuggestedCategoryMenu, setOpenSuggestedCategoryMenu] = useState<boolean>(false);
    const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
    const [categoryIsLoading, setCategoryIsLoading] = useState<boolean>(false);
    const debounceCategoryValue = useDebounced(categoryValue);
    const [isFetchAttributes, setIsFetchAttributes] = useState<boolean>(false);
    const {
        register,
        // setError,
        setValue,
        handleSubmit,
        // getValues,
        formState: {errors}
    } = useForm<InputTypes>();
    const [categoryFetchedAttributes, setCategoryFetchedAttributes] = useState<string>("")
    const {catAttributesData} = useGetCatAttributes({categoryName: categoryFetchedAttributes}, isFetchAttributes);

    const handleDateChanges = (date: DateObject) => {
        const gregorianDate = date.convert(gregorian);
        const formattedDate = `${gregorianDate.year}-${String(gregorianDate.month.number).padStart(2, '0')}-${String(gregorianDate.day).padStart(2, '0')}`;
        setValue("expiryDiscount", formattedDate)
    }

    const handleChange = (e: string) => {
        const value = e.replace(/\D/g, "");
        const formattedValue = new Intl.NumberFormat().format(Number(value));
        setValue("price",  formattedValue)
    }

    const onSubmit: SubmitHandler<InputTypes> = async(data) => {
        console.log(data);
    }

    useEffect(() => {
        if (debounceBrandValue) {
            axios.get<string[]>(`${EXTERNAL_BRAND_SEARCH}/?brand_name=${debounceBrandValue}`)
            .then((response) => setSuggestedBrands(response.data))
            setBrandIsLoading(false);
        }
    }, [debounceBrandValue])

    useEffect(() => {
        if (debounceCategoryValue) {
            axios.get<string[]>(`${EXTERNAL_CATEGORY_SEARCH}/?category_name=${debounceCategoryValue}`)
            .then((response) => setSuggestedCategories(response.data))
            setCategoryIsLoading(false);
        }
    }, [debounceCategoryValue])

    useEffect(() => {
        if (categoryValue) {
            setCategoryIsLoading(true);
        }
    }, [categoryValue])

    useEffect(() => {
        if (brandValue) {
            setBrandIsLoading(true);
        }
    }, [brandValue])

    const brandChangeHandler = (e: string) => {
        setBrandValue(e);
        if (e.length >= 2) {
            setOpenSuggestedBrandMenu(true);
        } else {
            setOpenSuggestedBrandMenu(false);
        }
    };

    const categoryChangeHandler = (e: string) => {
        setCategoryValue(e);
        if (e.length >= 2) {
            setOpenSuggestedCategoryMenu(true);
        } else {
            setOpenSuggestedCategoryMenu(false);
        }
    }

    const fetchAttributes = (categoryName: string) => {
        setIsFetchAttributes(true)
        setCategoryFetchedAttributes(categoryName)
    }
    console.log(catAttributesData);

    return (
        <div className="border-2 rounded-md border-blue-300 bg-blue-50 w-3/4 mx-auto mt-16 py-10">
            <h1 className="text-center text-lg text-blue-900">فرم ثبت محصول</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-8 px-2">
                <div className="flex flex-col w-full gap-1">
                    <label>مدل محصول</label>
                    <input {...register("name", {
                        required: "لطفا مدل محصول را وارد کنید."
                    })} className="h-10 rounded-md border-blue-100 px-2" type="text" />
                    {errors.name && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.name.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>شماره سریال محصول</label>
                    <input {...register("serialNumber", {
                        required: "لطفا شماره سریال محصول را وارد کنید."
                    })} className="h-10 rounded-md border-blue-100 px-2" type="text"/>
                    {errors.serialNumber && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.serialNumber.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>قیمت(ریال)</label>
                    <input {...register("price", {
                        required: "لطفا قیمت محصول را وارد کنید.",
                        onChange: (e) => handleChange(e.target.value),
                    })} className="h-10 rounded-md border-blue-100 px-2" type="text"/>
                    {errors.price && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.price.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>موجودی</label>
                    <input {...register("stock")} className="h-10 rounded-md border-blue-100 px-2" type="number" min={0}/>
                    {errors.stock && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.stock.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>تخفیف(درصد)</label>
                    <input {...register("discount")} className="h-10 rounded-md border-blue-100 px-2" type="number" min={0} max={100}/>
                    {errors.discount && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.discount.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <p>تاریخ انقضای تخفیف را انتخاب کنید</p>
                    <DatePicker
                        onChange={handleDateChanges}
                        calendar={persian}
                        locale={persian_fa}
                        hideYear
                        placeholder="Click here"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label>برند</label>
                    <input className="h-10 rounded-md border-blue-100 px-2" dir="ltr" {...register("brandName", {
                        required: "لطفا برند محصول را وارد کنید.",
                        onChange: (e) => brandChangeHandler(e.target.value)
                    })} />
                    {!openSuggestedBrandMenu && <div className="text-xs flex items-center gap-1 bg-yellow-400 rounded-md p-1">
                        <AiOutlineWarning size={20} />
                        <p>برند وارد شده حتما باید از موارد پیشنهاد شده باشد.</p>
                    </div>}
                    {openSuggestedBrandMenu  && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2 text-sm">
                        {brandIsLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : suggestedBrands.length <= 0 ? <p className="text-red-600">برندی یافت نشد</p> : suggestedBrands.map(brand => <li onClick={() => {
                            setValue("brandName", brand);
                            setOpenSuggestedBrandMenu(false);
                        }} className="cursor-pointer overflow-hidden hover:bg-gray-100 rounded-md px-2 py-1 transition-colors duration-300" key={brand}>{brand}</li>)}
                    </ul>}
                    {errors.brandName && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.brandName.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>دسته بندی</label>
                    <input className="h-10 rounded-md border-blue-100 px-2" {...register("categoryName", {
                        required: "لطفا دسته بندی محصول را وارد کنید.",
                        onChange: (e) => categoryChangeHandler(e.target.value)
                    })} />
                    {!openSuggestedCategoryMenu && <div className="text-xs flex items-center gap-1 bg-yellow-400 rounded-md p-1">
                        <AiOutlineWarning size={20} />
                        <p>دسته بندی وارد شده حتما باید از موارد پیشنهاد شده باشد.</p>
                    </div>}
                    {openSuggestedCategoryMenu  && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2 text-sm">
                        {categoryIsLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : suggestedCategories.length <= 0 ? <p className="text-red-600">دسته بندی یافت نشد</p> : suggestedCategories.map(category => <li onClick={() => {
                            setValue("categoryName", category);
                            fetchAttributes(category);
                            setOpenSuggestedCategoryMenu(false);
                        }} className="cursor-pointer overflow-hidden hover:bg-gray-100 rounded-md px-2 py-1 transition-colors duration-300" key={category}>{category}</li>)}
                    </ul>}
                    {errors.brandName && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.brandName.message}</span>}
                </div>
                {/* {catAttributesIsPending && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />} */}
                <button>ارسال</button>
            </form>
        </div>
    )
};

export default ProductCreate;