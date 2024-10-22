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
        <div className="pt-12 relative w-screen h-screen flex items-center justify-center">
            <span className="absolute top-56 left-5 min-[440px]:left-20 min-[560px]:left-36 min-[680px]:left-56 min-[860px]:left-72 min-[990px]:left-96 min-[1150px]:left-auto bg-gradient-to-bl from-sky-200 via-sky-500 to-sky-950 shadow-lg w-28 h-28 rounded-full"></span>

            <div className="relative z-20 w-64 bg-white/30 border-b-2 border-r-2 border-sky-500/20 backdrop-blur-lg rounded-3xl flex flex-col items-center p-4">
                <h1 className="text-sky-600 text-lg">درخواست مجدد کد فعالسازی</h1>
                <form className="flex flex-col gap-7 pt-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sky-600">شماره موبایل</label>
                        <input {...register("phoneNumber", { 
                        required: "لطفا شماره موبایل خود را وارد کنید.",
                        validate: (value) => {
                            if (value.length !== 11) {
                                return "شماره موبایل باید دقیقا یازده عدد باشد."
                            }
                            return true
                        }
                    })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" dir="ltr" type="text" placeholder="0913*******" />
                    {errors.phoneNumber && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.phoneNumber.message}</span>}
                    </div>
                    <button disabled={isSubmitting} type="submit" className="bg-gradient-to-l text-white from-sky-500 via-sky-700 to-sky-950 rounded-md p-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "دریافت کد فعالسازی"}</button>
                </form>
            </div>
        </div>
        
    )
};

export default Page;