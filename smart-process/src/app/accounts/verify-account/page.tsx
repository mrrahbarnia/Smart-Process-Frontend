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
            {verifyAccountMessage === "شما با موفقیت ثبت نام شدید,لطفا حساب کاربری خود را فعال کنید." && <p className="bg-gradient-to-l from-green-900 via-green-700 to-green-500 text-white text-xs pr-1 pb-2 pt-14 ">{verifyAccountMessage}</p>}
            <div className="flex justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                    <h1 className="text-center text-xl">فرم فعالسازی حساب کاربری</h1>
                    <p className="text-gray-600 text-sm">برای ورود به حساب کاربری خود,ابتدا باید با وارد نمودن کد پیامک شده حساب خود را فعال کنید.</p>
                    <div className="flex items-center gap-1 bg-yellow-500 rounded-md p-1 w-fit">
                        <AiFillWarning size={16} />
                        <p className="text-xs">کد فعالسازی ارسال شده به مدت سه دقیقه معتبر است.</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>کد فعالسازی</label>
                        <input {...register("verificationCode", { 
                            required: "لطفا کد فعالسازی خود را وارد کنید.",
                            validate: (value) => {
                                if (value.length !== 6) {
                                    return "کد فعالسازی باید دقیقا شش حرف باشد."
                                }
                                return true
                            }
                        })} type="text" className="h-9 rounded-md px-2" dir="ltr" />
                        {errors.verificationCode && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.verificationCode.message}</span>}
                    </div>
                    <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "فعالسازی"}</button>
                    <Link className="mx-auto text-sm underline underline-offset-4 hover:text-blue-800 transition duration-200" href="/accounts/verify-account/resend/">دریافت مجدد کد فعالسازی</Link>
                </form>
            </div>
        </Fragment>
        
    )
};

export default Page;