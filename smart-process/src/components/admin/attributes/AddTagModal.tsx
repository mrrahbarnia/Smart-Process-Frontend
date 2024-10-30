"use client"
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import useDebounced from "@/hooks/useDebounced";
import useAssignArticleTag from "@/hooks/useMutations/useAssignArticleTag";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

const EXTERNAL_TAG_SEARCH = `${EXTERNAL_BASE_ENDPOINT}/articles/search-tags/`

type InputTypes = {
    name: string
}


const AddTagModal = ({articleId, closeModalHandler}: {articleId: string, closeModalHandler: Dispatch<SetStateAction<boolean>>}) => {
    const router = useRouter();
    const {assignMutateAsync, isSuccess, isPending} = useAssignArticleTag();
    const logout = useAuthStore((state) => state.logout);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openSuggestedTagsMenu, setOpenSuggestedTagsMenu] = useState<boolean>(false);
    const [attributeValue, setAttributeValue] = useState<string>("");
    const debounceValue = useDebounced(attributeValue);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue
    } = useForm<InputTypes>()

    useEffect(() => {
        if (attributeValue) {
            setIsLoading(true);
        }
    }, [attributeValue]);

    useEffect(() => {
        if (debounceValue) {
            axios.get<string[]>(`${EXTERNAL_TAG_SEARCH}?tag_name=${debounceValue}`)
            .then((response) => setSuggestedTags(response.data))
            setIsLoading(false);
        }
    }, [debounceValue])

    const onSubmit: SubmitHandler<InputTypes> = (data) => {
        assignMutateAsync({articleId: articleId, tagName: data.name})
        .then(() => {
            setOpenSuggestedTagsMenu(false);
            setValue("name", "");
        })
        .catch(error => {
            console.log(error);
            if (axios.isAxiosError(error)) {
                setOpenSuggestedTagsMenu(false);
                if (error.status === 403) {
                    logout();
                    return router.replace("/accounts/login/")
                }
                // if (error.response?.data && error.response?.data.detail === "There is no attribute with the provided info!") {
                //     setError("name", { message: "ویژگی باید از بین موارد پیشنهاد شده باشد."})
                // }
                // if (error.response?.data && error.response?.data.detail === "category_id and attribute_id are unique together!") {
                //     setError("name", { message: "ویژگی برای این دسته بندی تکراریست."})
                // }
            } else {
                setError("name", { message: "مشکلی در شبکه بوجود آمده است." })
            }
        })
    }

    const attributeChangeHandler = (e: string) => {
        setAttributeValue(e);
        if (e.length >= 2) {
            setOpenSuggestedTagsMenu(true);
        } else {
            setOpenSuggestedTagsMenu(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-100 to-blue-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-2 w-full px-4">
                <div className="flex flex-col gap-1">
                    <label>تگ مورد نظر را وارد کنید</label>
                    <input {...register("name", {
                        required: "لطفا تگ مورد نظر را وارد کنید.",
                        onChange: (e) => attributeChangeHandler(e.target.value)
                        })} type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                    {openSuggestedTagsMenu  && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2 text-sm">
                        {isLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : suggestedTags.length <= 0 ? <p className="text-red-600">تگ یافت نشد</p> : suggestedTags.map(attr => <li onClick={() => {
                            setValue("name", attr);
                            setOpenSuggestedTagsMenu(false);
                        }} className="cursor-pointer overflow-hidden hover:bg-gray-100 rounded-md px-2 py-1" key={attr}>{attr}</li>)}
                    </ul>}
                    {errors.name && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.name.message}</span>}
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" className="bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200 transition-colors duration-300" onClick={() => closeModalHandler(false)}>انصراف</button>
                    <button type="submit" className="bg-green-50 text-green-600 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200 transition-colors duration-300">{isPending ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "تأیید" }</button>
                </div>
                {isSuccess && <p className="text-green-800 rounded-md text-sm bg-green-100 p-1">تگ با موفقیت متصل شد.</p>}
            </form>
        </div>
    )
};

export default AddTagModal;
