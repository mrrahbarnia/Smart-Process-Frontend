"use client"
import axios from "axios";
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect, ChangeEvent } from "react";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import useGetCatAttributes from "@/hooks/useQueries/useGetCatAttributes";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/useMutations/useCreateProduct";
import useDebounced from "@/hooks/useDebounced";
import DatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";

const EXTERNAL_CATEGORY_SEARCH = `${EXTERNAL_BASE_ENDPOINT}/products/search-categories`
const EXTERNAL_BRAND_SEARCH = `${EXTERNAL_BASE_ENDPOINT}/products/search-brands`

type InputTypes = {
    discount: string,
    categoryName: string,
    price: string,
    name: string,
    brandName: string,
    expiryDiscount: string,
    stock: string,
    description: string,
    serialNumber: string,
    image: File[],
    attributeValues: Record<string, string>[]
}


const ProductCreate = () => {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const {createIsPending, createMutateAsync} = useCreateProduct();
    const [openSuggestedBrandMenu, setOpenSuggestedBrandMenu] = useState<boolean>(false);
    const [suggestedBrands, setSuggestedBrands] = useState<string[]>([]);
    const [brandIsLoading, setBrandIsLoading] = useState<boolean>(false);
    const [brandValue, setBrandValue] = useState<string>("");
    const debounceBrandValue = useDebounced(brandValue);
    const [categoryValue, setCategoryValue] = useState<string>("");
    const [openSuggestedCategoryMenu, setOpenSuggestedCategoryMenu] = useState<boolean>(false);
    const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
    const [categoryIsLoading, setCategoryIsLoading] = useState<boolean>(false);
    const [selectedImageName, setSelectedImageName] = useState<string[]>([]);
    const debounceCategoryValue = useDebounced(categoryValue);
    const [isFetchAttributes, setIsFetchAttributes] = useState<boolean>(false);
    const {
        register,
        setError,
        setValue,
        handleSubmit,
        formState: {errors}
    } = useForm<InputTypes>();
    const [categoryFetchedAttributes, setCategoryFetchedAttributes] = useState<string>("")
    const {catAttributesData, catAttributesIsLoading} = useGetCatAttributes(
        {categoryName: categoryFetchedAttributes},
        isFetchAttributes
    );

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
        if (data.image.length > 3) {
            setError("image", { message: "حداکثر مجاز به بارگذاری سه عکس میباشید." });
            return;
        }
        // if (data.discount && !data.expiryDiscount) {
        //     setError("expiryDiscount", { message: "برای وارد کردن تخفیف باید تاریخ انقضای آن هم انتخاب گردد." });
        //     return;
        // }
        // if (!data.discount && data.expiryDiscount) {
        //     setError("discount", { message: "تاریخ انقضای تخفیف باید همراه با مقدار تخفیف وارد شود." });
        //     return;
        // }
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("serialNumber", data.serialNumber)
        formData.append("description", data.description)
        formData.append("price", data.price)
        formData.append("categoryName", data.categoryName)
        formData.append("brandName", data.brandName)
        formData.append("stock", data.stock)
        formData.append("discount", data.discount)
        if (data.expiryDiscount) {
            formData.append("expiryDiscount", data.expiryDiscount)
        }
        if (data.attributeValues) {
            formData.append("attributeValues", JSON.stringify(data.attributeValues))
        }
        for (let i = 0; i < data.image.length; i++) {
            formData.append("images", data.image[i]);
        }

        createMutateAsync(formData)
        .then(() => {
            return router.replace("/admin/products/")
        })
        .catch((error) => {
            console.log(error);
            

            if (error.status === 403) {
                logout();
                return router.replace("/accounts/login/")
            }
            if (error.response && error.response.data?.detail === "Image size limit is 400000 KB!") {
                setError("image", { message: "حداکثر حجم عکس ها باید ۴۰۰ کیلوبایت شود." })
                return;
            }
            if (error.response && error.response.data?.detail === "There is no brand with the provided info!") {
                setError("brandName", { message: "برند محصول باید از بین موارد پیشنهادی باشد." })
                return;
            }
            if (error.response && error.response.data?.detail === "There is no category with the provided ID!") {
                setError("categoryName", { message: "دسته بندی محصول باید از بین موارد پیشنهادی باشد." })
                return;
            }
            if (error.response && error.response.data?.detail === "Unique serial number for products!") {
                setError("serialNumber", { message: "کد محصول باید یکتا باشد." })
                return;
            }
            if (error.response && error.response.data?.detail === "Unique name for products!") {
                setError("name", { message: "مدل محصول باید یکتا باشد." })
                return;
            }
            if (error.response && error.response.data?.detail && error.response.data.detail[0] && error.response.data.detail[0].msg === "Value error, Discount and expiry_discount must used together!") {
                setError("root", { message: "درصد تخفیف و تاریخ انقضای تخفیف باید همراه با هم استفاده شوند." })
            }
        })
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

    const imageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const fileNames = files.map((file) => file.name);
        setSelectedImageName(fileNames)
    }

    return (
        <div className="border-2 rounded-md border-blue-300 bg-blue-50 w-3/4 min-[650px]:w-2/3 min-[750px]:w-7/12 min-[850px]:w-6/12 min-[950px]:w-5/12 min-[1050px]:w-4/12 mx-auto mt-16 py-10">
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
                    <label>کد محصول</label>
                    <input {...register("serialNumber", {
                        required: "لطفا کد محصول را وارد کنید."
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
                    <input {...register("stock", {
                        required: "لطفا موجودی محصول را وارد کنید.",
                    })} className="h-10 rounded-md border-blue-100 px-2" type="number" min={0}/>
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
                    {errors.expiryDiscount && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.expiryDiscount.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="bg-blue-200 hover:bg-blue-300 text-blue-950 p-1 rounded-md cursor-pointer w-fit transition-colors duration-300" htmlFor="imageInput">عکس های محصول</label>
                    <input multiple id="imageInput" hidden className="h-10 rounded-md border-blue-100 px-2" type="file" dir="ltr" {...register("image", {
                        required: "لطفا حداقل یک عکس را بارگذاری کنید.",
                        onChange: imageChangeHandler
                    })} />
                    <div className="text-xs flex items-center gap-1 bg-yellow-400 rounded-md p-1">
                        <AiOutlineWarning size={20} />
                        <p>حداکثر مجاز به بارگذاری سه عکس میباشید.</p>
                    </div>
                    <div className="flex flex-col justify-start gap-1">
                        {selectedImageName.map((imageName) => <span className="bg-green-700 text-white px-2 py-1 text-sm rounded-md w-fit mx-auto" key={imageName}>{imageName}</span>)}
                    </div>
                    {errors.image && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.image.message}</span>}
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
                    {errors.categoryName && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.categoryName.message}</span>}
                </div>
                {catAttributesIsLoading && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />}
                {catAttributesData && <div className="w-2/3 mx-auto flex flex-col gap-1 bg-white rounded-md p-1">
                        <h2 className="text-center pb-2">ویژگی ها</h2>
                        {catAttributesData && catAttributesData.length === 0 ? <p className="text-xs rounded-md text-red-800 bg-red-200 p-1">برای این دسته بندی ویژگی موجود نمیباشد.</p> : catAttributesData && catAttributesData.map((attribute, index) => <div className="w-full flex items-center justify-between" key={attribute}>
                            <label className="text-sm">{attribute}</label>
                            <input className="h-10 w-28 rounded-md bg-blue-100 border-blue-200 px-2" type="text" {...register(`attributeValues.${index}.value`)} />
                            <input type="hidden" value={attribute} {...register(`attributeValues.${index}.attribute`)} />
                        </div>)
                        }
                    </div>}
                    {errors.attributeValues && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.attributeValues.message}</span>}
                <div className="flex flex-col gap-1">
                    <label>توضیحات</label>
                    <textarea rows={6} className="rounded-md border-blue-100 px-2 resize-none p-1" {...register("description", {
                        required: "لطفا توضیحات محصول را وارد کنید."
                    })}  />
                    {errors.description && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.description.message}</span>}
                </div>
                {errors.root && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.root.message}</span>}
                <button disabled={createIsPending} className="w-2/3 mx-auto bg-blue-200 hover:bg-blue-300 text-blue-950 p-1 rounded-md transition-colors duration-300">{createIsPending ? <AiOutlineLoading3Quarters className="mx-auto animate-spin"/> : "تأیید"}</button>
            </form>
        </div>
    )
};

export default ProductCreate;
