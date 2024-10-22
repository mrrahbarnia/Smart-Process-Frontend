"use client"
import axios from "axios";
import { useEffect } from "react";
import { useAccountsStore } from "@/store/useAccountsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { useRouter } from "next/navigation";
import Link from "next/link";

type InputTypes = {
    phoneNumber: string,
    username: string,
    password: string,
    confirmPassword: string
}

const Page = () => {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const setVerifyAccountMessage = useAccountsStore((state) => state.setVerifyAccountMessage)
    const { 
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<InputTypes>();
    
    useEffect(() => {
        if (isAuthenticated) {
            return router.replace("/");
        }
    }, [isAuthenticated, router])

    const onSubmit: SubmitHandler<InputTypes>  = async(data) => {

        try {
            await axios.post(
                `${EXTERNAL_BASE_ENDPOINT}/auth/register/`, data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            setVerifyAccountMessage("شما با موفقیت ثبت نام شدید,لطفا حساب کاربری خود را فعال کنید.");
            return router.replace("/accounts/verify-account/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data && error.response.data?.detail === "Phone number already exists") {
                    setError("phoneNumber", {message: "شماره موبایل وارد شده تکراریست."})
                }
                if (error.response?.data && error.response.data?.detail === "Username already exists") {
                    setError("username", {message: "نام کاربری وارد شده تکراریست."})
                }
                if (error.response?.data && error.response.data?.detail && error.response.data?.detail[0]?.msg === "Value error, Passwords don't match!") {
                    setError("confirmPassword", { message: "رمز های عبور مطابقت ندارند."})
                }
            } else {
                setError("root", { message: "مشکلی در سرور بوجود آمده است." })
            }
        }
    };

    return (
        <div className="pt-12 relative w-screen h-screen flex items-center justify-center">
            <span className="absolute top-16 left-5 min-[440px]:left-20 min-[560px]:left-36 min-[680px]:left-56 min-[860px]:left-72 min-[990px]:left-96 min-[1150px]:left-auto bg-gradient-to-bl from-sky-200 via-sky-500 to-sky-950 shadow-lg w-28 h-28 rounded-full"></span>

            <div className="relative z-20 w-64 bg-white/30 border-b-2 border-r-2 border-sky-500/20 backdrop-blur-lg rounded-3xl flex flex-col items-center p-4">
                <h1 className="text-sky-600 text-lg">فرم ثبت نام</h1>
                <form className="flex flex-col gap-7 pt-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sky-600">شماره موبایل</label>
                        <input {...register("phoneNumber", { 
                        required: "لطفا شماره موبایل خود را وارد کنید.",
                        validate: (value) => {
                            if (value.length !== 11) {
                                return "شماره موبایل بایستی دقیقا یازده عدد باشد."
                            }
                            return true
                        }
                    })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" dir="ltr" type="text" placeholder="0913*******" />
                    {errors.phoneNumber && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.phoneNumber.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sky-600">نام کاربری</label>
                        <input {...register("username", { 
                            required: "لطفا نام کاربری خود را وارد کنید.",
                            maxLength: {
                                value: 100,
                                message: "نام کاربری نباید بیشتر از صد حرف باشد."
                            }
                        })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" dir="ltr" type="text" placeholder="example" />
                    {errors.username && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.username.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sky-600">رمز عبور</label>
                        <input {...register("password", {
                            required: "لطفا رمز عبور خود را وارد کنید.",
                            minLength: {
                                value: 8,
                                message: "رمز عبور باید حداقل هشت حرف باشد."
                            }
                        })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" type="password" placeholder="********" dir="ltr" />
                    {errors.password && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.password.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sky-600">تکرار رمز عبور</label>
                        <input {...register("confirmPassword", {
                            required: "لطفا رمز عبور خود را تکرار کنید.",
                        })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" type="password" placeholder="********" dir="ltr" />
                    {errors.password && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.password.message}</span>}
                    </div>
                    <button disabled={isSubmitting} type="submit" className="bg-gradient-to-l text-white from-sky-500 via-sky-700 to-sky-950 rounded-md p-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "ثبت نام"}</button>
                    <div className="flex flex-col items-center">
                        <p className="text-xs">حساب کاربری دارید؟</p>
                        <Link className="text-sm underline underline-offset-4 text-sky-700 decoration-sky-400" href="/accounts/login/">ورود</Link>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Page;