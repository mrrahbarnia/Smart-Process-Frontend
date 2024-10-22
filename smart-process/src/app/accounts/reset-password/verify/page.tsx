"use client"
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { useAccountsStore } from "@/store/useAccountsStore";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/auth/reset-password/verify/`;

type InputTypes = {
    randomPassword: string
}

const Page = () => {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const setLoginMessage = useAccountsStore((state) => state.setLoginMessage)
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
            setLoginMessage("رمز عبور شما موقتا تغییر یافت,بعد از ورود در قسمت تغییر رمز عبور میتوانید آنرا به رمز دلخواه خود تغییر دهید.")
            return router.replace("/accounts/login/");
        } catch {
            setError("randomPassword", {message: "رمز یکبار مصرف وارد شده نامعتبر است."})
            return;
        }
    };

    return (
        // <div className="flex justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
        //     <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
        //         <h1 className="text-center text-xl">فرم تأیید نهایی رمز عبور</h1>
        //         <p className="text-gray-600 text-sm">رمز عبور ارسالی رمز موقت شماست,لطفا آنرا یادداشت کنید.</p>
        //         <div className="flex items-center gap-1 bg-yellow-500 rounded-md p-1 w-fit">
        //             <AiFillWarning size={16} />
        //             <p className="text-xs">رمز عبور یکبار مصرف به مدت سه دقیقه معتبر است.</p>
        //         </div>
        //         <div className="flex flex-col gap-1">
        //             <label>رمز عبور یکبار مصرف</label>
        //             <input {...register("randomPassword", {
        //                 required: "لطفا رمز یکبار مصرفت خود را وارد کنید.",
        //                 validate: (value) => {
        //                     if (value.length !== 8) {
        //                         return "رمز عبور یکبار مصرف باید دقیقا هشت حرف باشد."
        //                     }
        //                     return true
        //                 }
        //             })} type="password" dir="ltr" className="h-9 rounded-md px-2"/>
        //             {errors.randomPassword && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.randomPassword.message}</span>}
        //         </div>
        //         <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "تغییر رمز عبور"}</button>
        //         <Link className="mx-auto text-sm underline underline-offset-4 hover:text-blue-800 transition duration-200" href="/accounts/reset-password/">دریافت مجدد رمز یک بار مصرف</Link>
        //     </form>
        // </div>

    <div className="pt-12 relative w-screen h-screen flex items-center justify-center">
        <span className="absolute top-56 left-5 min-[440px]:left-20 min-[560px]:left-36 min-[680px]:left-56 min-[860px]:left-72 min-[990px]:left-96 min-[1150px]:left-auto bg-gradient-to-bl from-sky-200 via-sky-500 to-sky-950 shadow-lg w-28 h-28 rounded-full"></span>

        <div className="relative z-20 w-64 bg-white/30 border-b-2 border-r-2 border-sky-500/20 backdrop-blur-lg rounded-3xl flex flex-col items-center p-4">
            <h1 className="text-sky-600 text-lg">تأیید نهایی رمز عبور</h1>
            <form className="flex flex-col gap-7 pt-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-1">
                    <label className="text-sky-600">رمز عبور یکبار مصرف</label>
                    <input {...register("randomPassword", {
                        required: "لطفا رمز یکبار مصرفت خود را وارد کنید.",
                        validate: (value) => {
                            if (value.length !== 8) {
                                return "رمز عبور یکبار مصرف باید دقیقا هشت حرف باشد."
                            }
                            return true
                        }
                    })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" dir="ltr" type="password" placeholder="********" />
                {errors.randomPassword && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.randomPassword.message}</span>}
                </div>
                <button disabled={isSubmitting} type="submit" className="bg-gradient-to-l text-white from-sky-500 via-sky-700 to-sky-950 rounded-md p-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "تغییر رمز عبور"}</button>
                <Link className="text-sm underline underline-offset-4 text-sky-700 decoration-sky-400 mx-auto" href="/accounts/reset-password/">دریافت مجدد رمز یک بار مصرف</Link>
            </form>
        </div>
    </div>
        
    )
};

export default Page;