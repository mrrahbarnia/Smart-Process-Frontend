"use client"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const INTERNAL_API = "/apis/admin/add-guaranties/";

type InputTypes = {
    file: File[]
}


const Page = () => {
    const rule = useAuthStore((state) => state.rule)
    const logout = useAuthStore((state) => state.logout);
    const [fileName, setFileName] = useState<string>("");
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting, isSubmitSuccessful }
    } = useForm<InputTypes>();

    useEffect(() => {
        if (rule !== "admin") {
            return router.replace("/accounts/login/")
        }
    }, [rule, router])

    const onSubmit: SubmitHandler<InputTypes>  = async(data) => {
        const formData = new FormData()
        formData.append("file", data.file[0])

        try {
            await axios.post(INTERNAL_API, formData)
            setFileName("");
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                if (error.response?.data && error.response?.data.message === "Could not validate credentials") {
                    logout();
                    return router.replace("/accounts/login/")
                }
            } else {
                setError("file", { message: "مشکلی در سرور بوجود آمده است." })
            }
        }
    };

    return (
        <div className="flex justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                <h1 className="text-center text-xl">فرم بارگذاری فایل گارانتی ها</h1>
                <div className="flex flex-col gap-1 bg-blue-100 text-blue-800 hover:bg-blue-300 mx-auto p-2 rounded-md transition duration-200">
                    <label htmlFor="file" className="cursor-pointer">انتخاب فایل</label>
                    <input 
                        id="file" 
                        hidden
                        {...register("file", { 
                            required: "لطفا فایل گارانتی ها را بارگذاری کنید.",
                            onChange: (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFileName(file.name)
                                }
                            }
                        })}
                        type="file"
                        className="h-9 rounded-md px-2"
                        placeholder="0913*******"
                        dir="ltr"
                    />
                </div>
                {fileName && <span className="bg-green-700 text-white px-2 py-1 text-sm rounded-md w-fit mx-auto">{fileName}</span>}
                {errors.file && !fileName && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.file.message}</span>}
                {isSubmitSuccessful && <span className="bg-green-700 text-white text-sm px-2 py-1 rounded-md">فایل با موفقیت بارگذاری شد.</span>}
                <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "باگذاری"}</button>
            </form>
        </div>
    )
};

export default Page;