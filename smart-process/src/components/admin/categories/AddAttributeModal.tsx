"use client"
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import useDebounced from "@/hooks/useDebounced";
import useAssignCatAttr from "@/hooks/useMutations/useAssignCatAttr";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

const EXTERNAL_ATTRIBUTE_SEARCH = `${EXTERNAL_BASE_ENDPOINT}/products/search-attribute/`

type InputTypes = {
    name: string
}


const AddAttributeModal = ({categoryId, closeModalHandler}: {categoryId: number, closeModalHandler: Dispatch<SetStateAction<boolean>>}) => {
    const router = useRouter();
    const {assignMutateAsync, isSuccess} = useAssignCatAttr();
    const logout = useAuthStore((state) => state.logout);
    const [suggestedAttributes, setSuggestedAttributes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openSuggestedAttributesMenu, setOpenSuggestedAttributesMenu] = useState<boolean>(false);
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
            axios.get<string[]>(`${EXTERNAL_ATTRIBUTE_SEARCH}?attribute_name=${debounceValue}`)
            .then((response) => setSuggestedAttributes(response.data))
            setIsLoading(false);
        }
    }, [debounceValue])

    const onSubmit: SubmitHandler<InputTypes> = (data) => {
        assignMutateAsync({categoryId: categoryId, attributeName: data.name})
        .then(() => {
            setOpenSuggestedAttributesMenu(false);
            setValue("name", "");
        })
        .catch(error => {
            if (axios.isAxiosError(error)) {
                setOpenSuggestedAttributesMenu(false);
                if (error.status === 403) {
                    logout();
                    return router.replace("/accounts/login/")
                }
                if (error.response?.data && error.response?.data.detail === "There is no attribute with the provided info!") {
                    setError("name", { message: "ویژگی باید از بین موارد پیشنهاد شده باشد."})
                }
                if (error.response?.data && error.response?.data.detail === "category_id and attribute_id are unique together!") {
                    setError("name", { message: "ویژگی برای این دسته بندی تکراریست."})
                }
            } else {
                setError("name", { message: "مشکلی در شبکه بوجود آمده است." })
            }
        })
    }

    const attributeChangeHandler = (e: string) => {
        setAttributeValue(e);
        if (e.length >= 2) {
            setOpenSuggestedAttributesMenu(true);
        } else {
            setOpenSuggestedAttributesMenu(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-100 to-blue-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-2 w-full px-4">
                <div className="flex flex-col gap-1">
                    <label>ویژگی مورد نظر را وارد کنید</label>
                    <input {...register("name", {
                        required: "لطفا ویژگی مورد نظر را وارد کنید.",
                        onChange: (e) => attributeChangeHandler(e.target.value)
                        })} type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                    {openSuggestedAttributesMenu  && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2 text-sm">
                        {isLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : suggestedAttributes.length <= 0 ? <p className="text-red-600">ویژگی یافت نشد</p> : suggestedAttributes.map(attr => <li onClick={() => {
                            setValue("name", attr);
                            setOpenSuggestedAttributesMenu(false);
                        }} className="cursor-pointer overflow-hidden hover:bg-gray-100 rounded-md px-2 py-1" key={attr}>{attr}</li>)}
                    </ul>}
                    {errors.name && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.name.message}</span>}
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" className="bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200 transition-colors duration-300" onClick={() => closeModalHandler(false)}>انصراف</button>
                    <button type="submit" className="bg-green-50 text-green-600 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200 transition-colors duration-300">تأیید</button>
                </div>
                {isSuccess && <p className="text-green-800 rounded-md text-sm bg-green-100 p-1">ویژگی با موفقیت متصل شد.</p>}
            </form>
        </div>
    )
};

export default AddAttributeModal;
