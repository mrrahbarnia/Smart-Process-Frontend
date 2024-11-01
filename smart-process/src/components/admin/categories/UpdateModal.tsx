"use client"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import useDebounced from "@/hooks/useDebounced";
import { useForm, SubmitHandler } from "react-hook-form";
import {useUpdateCategory, requestType} from "@/hooks/useMutations/useUpdateCategory";
import { CategoryType } from "@/hooks/useQueries/useGetAllCategories";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const EXTERNAL_CATEGORY_SEARCH_API = `${EXTERNAL_BASE_ENDPOINT}/products/search-categories/?category_name=`;

type InputTypes = {
    name: string,
    description: string,
    parentCategoryName?: string | null
}


const UpdateModal = ({category, closeModalHandler}: {category: CategoryType, closeModalHandler: Dispatch<SetStateAction<boolean>>}) => {
    const logout = useAuthStore(state => state.logout);
    const router = useRouter();
    const [parentCategory, setParentCategory] = useState<string>("");
    const debounceValue = useDebounced(parentCategory);
    const [suggestedParentCategories, setSuggestedParentCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openSuggestedCategoriesMenu, setOpenSuggestedCategoriesMenu] = useState<boolean>(false);
    const {updateIsPending, updateMutateAsync} = useUpdateCategory();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError
    } = useForm<InputTypes>({
        defaultValues: {
            name: category.name,
            description: category.description,
            parentCategoryName: category.parentName
        }
    })

    useEffect(() => {
        if (parentCategory) {
            setIsLoading(true);
        }
    }, [parentCategory]);

    useEffect(() => {
        if (debounceValue) {
            axios.get<string[]>(`${EXTERNAL_CATEGORY_SEARCH_API}${debounceValue}`)
            .then((response) => setSuggestedParentCategories(response.data))
            setIsLoading(false);
        }
    }, [debounceValue])

    const onSubmit: SubmitHandler<InputTypes> = (data: requestType) => {
        updateMutateAsync({id: category.id, data: data})
        .then(() => {
            closeModalHandler(false);
        })
        .catch(error => {
            if (error.status === 403) {
                logout();
                return router.replace("/accounts/login/")
            }
            if (error.response && error.response.data?.detail === 'Invalid parent category name!') {
                setError("parentCategoryName", { message: "دسته بندی والد حتما باید از موارد پیشنهاد شده باشد." })
            }
            if (error.response && error.response.data?.detail === 'Unique name for categories!') {
                setError("name", { message: "نام دسته بندی تکراریست." })
            }
        })
    }

    const parentCategoryChangeHandler = (e: string) => {
        setParentCategory(e);
        if (e.length >= 2) {
            setOpenSuggestedCategoriesMenu(true);
        } else {
            setOpenSuggestedCategoriesMenu(false);
        }
    }

    return (
        <div className="bg-gradient-to-b from-blue-100 to-blue-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full px-4">
                <div className="flex flex-col gap-1">
                    <label>نام دسته بندی</label>
                    <input {...register("name", {
                        required: "لطفا نام دسته بندی را وارد کنید."
                    })}  type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                </div>
                {errors.name && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.name.message}</span>}
                <div className="flex flex-col gap-1">
                    <label>توضیحات</label>
                    <textarea {...register("description", {
                        required: "لطفا توضیحات دسته بندی را وارد کنید."
                    })} rows={3} className="text-xs resize-none border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                </div>
                {errors.description && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.description.message}</span>}
                <div className="flex flex-col gap-1">
                    <label>نام دسته بندی والد</label>
                    <input {...register("parentCategoryName", {
                        onChange: (e) => parentCategoryChangeHandler(e.target.value),
                    })} type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                    {openSuggestedCategoriesMenu  && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2 text-sm">
                        {isLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : suggestedParentCategories.length <= 0 ? <p className="text-red-600">دسته بندی یافت نشد</p> : suggestedParentCategories.map(category => <li onClick={() => {
                            setValue("parentCategoryName", category);
                            setOpenSuggestedCategoriesMenu(false);
                        }} className="cursor-pointer overflow-hidden hover:bg-gray-100 rounded-md px-2 py-1" key={category}>{category}</li>)}
                    </ul>}
                </div>
                {errors.parentCategoryName && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.parentCategoryName.message}</span>}
                <div className="flex items-center gap-2 pt-6 mx-auto">
                    <button type="button" onClick={() => closeModalHandler(false)} className="bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200 transition-colors duration-300">انصراف</button>
                    <button disabled={updateIsPending} className="disabled:pointer-events-none disabled:text-gray-400 bg-yellow-50 text-yellow-600 px-6 py-1 rounded-md hover:bg-yellow-200 active:bg-yellow-200 transition-colors duration-300">{updateIsPending ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "بروزرسانی" }</button>
                </div>
            </form>
        </div>
    )
};

export default UpdateModal;