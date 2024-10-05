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
        <div className="flex justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                <h1 className="text-center text-xl">فرم ثبت نام</h1>
                <div className="flex flex-col gap-1">
                    <label>شماره موبایل</label>
                    <input {...register("phoneNumber", { 
                        required: "لطفا شماره موبایل خود را وارد کنید.",
                        validate: (value) => {
                            if (value.length !== 11) {
                                return "شماره موبایل بایستی دقیقا یازده عدد باشد."
                            }
                            return true
                        }
                    })} type="text" className="h-9 rounded-md px-2" placeholder="0913*******" dir="ltr" />
                    {errors.phoneNumber && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.phoneNumber.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>نام کاربری</label>
                    <input {...register("username", { 
                        required: "لطفا نام کاربری خود را وارد کنید.",
                        maxLength: {
                            value: 100,
                            message: "نام کاربری نباید بیشتر از صد حرف باشد."
                        }
                    })} type="text" className="h-9 rounded-md px-2" placeholder="example" dir="ltr"/>
                    {errors.username && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.username.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>رمز عبور</label>
                    <input {...register("password", {
                        required: "لطفا رمز عبور خود را وارد کنید.",
                        minLength: {
                            value: 8,
                            message: "رمز عبور باید حداقل هشت حرف باشد."
                        }
                    })} type="password" className="h-9 rounded-md px-2" placeholder="12345678" dir="ltr" />
                    {errors.password && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.password.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>تکرار رمز عبور</label>
                    <input {...register("confirmPassword", {
                        required: "لطفا رمز عبور خود را تکرار کنید.",
                    })} type="password" className="h-9 rounded-md px-2" dir="ltr" />
                    {errors.confirmPassword && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.confirmPassword.message}</span>}
                </div>
                <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "ثبت نام"}</button>
                <Link className="mx-auto text-sm underline underline-offset-4 hover:text-blue-800 transition duration-200" href="/accounts/login/">حساب کاربری دارم</Link>
            </form>
        </div>
    )
};

export default Page;