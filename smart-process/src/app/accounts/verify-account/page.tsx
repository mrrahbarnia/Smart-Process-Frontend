"use client"
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import { Fragment, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAccountsStore } from "@/store/useAccountsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { useRouter } from "next/navigation";
import Link from "next/link";

type InputTypes = {
    verificationCode: string
}

const Page = () => {
    const router = useRouter();
    const verifyAccountMessage = useAccountsStore((state) => state.verifyAccountMessage)
    const setVerifyAccountMessage = useAccountsStore((state) => state.setVerifyAccountMessage)
    const setLoginMessage = useAccountsStore((state) => state.setLoginMessage)
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

    useEffect(() => {
        if (verifyAccountMessage) {
            const id = setTimeout(() => {
                setVerifyAccountMessage("");
            }, 5000)
    
            return () => clearTimeout(id);
        }
    }, [verifyAccountMessage, setVerifyAccountMessage])

    const onSubmit: SubmitHandler<InputTypes>  = async(data) => {

        try {
            await axios.post(`${EXTERNAL_BASE_ENDPOINT}/auth/verify-account/`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setLoginMessage("حساب کاربری شما با موفقیت فعال شد.");
            return router.replace("/accounts/login/");
        } catch {
            setError("verificationCode", {message: "کد فعالسازی وارد شده نامعتبر است."})
        }
    };

    return (
        <Fragment>
            {verifyAccountMessage && <p className="bg-gradient-to-l from-green-900 via-green-700 to-green-500 text-white text-xs pr-1 pb-2 pt-14 ">{verifyAccountMessage}</p>}
            <div className="pt-12 relative w-screen h-screen flex items-center justify-center">
                <span className="absolute top-44 left-5 min-[440px]:left-20 min-[560px]:left-36 min-[680px]:left-56 min-[860px]:left-72 min-[990px]:left-96 min-[1150px]:left-auto bg-gradient-to-bl from-sky-200 via-sky-500 to-sky-950 shadow-lg w-28 h-28 rounded-full"></span>

                <div className="relative z-20 w-64 bg-white/30 border-b-2 border-r-2 border-sky-500/20 backdrop-blur-lg rounded-3xl flex flex-col items-center p-4">
                    <h1 className="text-sky-600 text-lg">فعالسازی حساب کاربری</h1>
                    <p className="text-gray-700 text-xs my-2">برای ورود به حساب کاربری خود,ابتدا باید با وارد نمودن کد پیامک شده حساب خود را فعال کنید.</p>
                    <div className="flex items-center gap-1 bg-yellow-500 rounded-md p-1 w-fit">
                        <AiFillWarning size={16} />
                        <p className="text-xs">کد فعالسازی ارسال شده به مدت سه دقیقه معتبر است.</p>
                    </div>
                    <form className="flex flex-col gap-7 pt-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-1">
                            <label className="text-sky-600">کد فعالسازی</label>
                            <input {...register("verificationCode", { 
                            required: "لطفا کد فعالسازی خود را وارد کنید.",
                            validate: (value) => {
                                if (value.length !== 6) {
                                    return "کد فعالسازی باید دقیقا شش حرف باشد."
                                }
                                return true
                            }
                        })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" dir="ltr" type="text" />
                        {errors.verificationCode && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.verificationCode.message}</span>}
                        </div>
                        <button disabled={isSubmitting} type="submit" className="bg-gradient-to-l text-white from-sky-500 via-sky-700 to-sky-950 rounded-md p-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "بازیابی"}</button>
                        <Link className="text-sm underline underline-offset-4 text-sky-700 decoration-sky-400 mx-auto" href="/accounts/verify-account/resend/">دریافت مجدد کد فعالسازی</Link>
                    </form>
                </div>
            </div>
        </Fragment>        
    )
};

export default Page;