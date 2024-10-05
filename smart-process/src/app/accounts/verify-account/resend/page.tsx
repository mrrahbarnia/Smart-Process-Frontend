"use client"
import axios from "axios";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAccountsStore } from "@/store/useAccountsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { useRouter } from "next/navigation";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/auth/resend/verification-code/`

type InputTypes = {
    phoneNumber: string
}

const Page = () => {
    const router = useRouter();
    const setVerifyAccountMessage = useAccountsStore((state) => state.setVerifyAccountMessage)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const { 
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<InputTypes>();
    
    useEffect(() => {
        if (isAuthenticated) {
            return router.back()
        }
    }, [isAuthenticated, router])

    const onSubmit: SubmitHandler<InputTypes>  = async(data) => {

        try {
            await axios.post(EXTERNAL_API, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setVerifyAccountMessage("کد فعالسازی جدید برای شما ارسال شد.");
            return router.replace("/accounts/verify-account/");
        } catch {
            setError("phoneNumber", {message: "حساب کاربری فعالی با شماره موبایل وارد شده یافت نشد."})
        }
    };

    return (
        <div className="flex justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                <h1 className="text-center text-xl">فرم درخواست مجدد کد فعالسازی</h1>
                <div className="flex flex-col gap-1">
                    <label>شماره موبایل</label>
                    <input {...register("phoneNumber", { 
                        required: "لطفا شماره موبایل خود را وارد کنید.",
                        validate: (value) => {
                            if (value.length !== 11) {
                                return "شماره موبایل باید دقیقا یازده عدد باشد."
                            }
                            return true
                        }
                    })} type="text" className="h-9 rounded-md px-2" dir="ltr" />
                    {errors.phoneNumber && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.phoneNumber.message}</span>}
                </div>
                <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "دریافت کد فعالسازی"}</button>
            </form>
        </div>
        
    )
};

export default Page;