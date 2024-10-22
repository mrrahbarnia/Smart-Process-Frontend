"use client"
import axios from "axios";
import { useEffect } from "react";
import { useAccountsStore } from "@/store/useAccountsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

const INTERNAL_API = "/apis/accounts/change-password/"

type InputTypes = {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

const Page = () => {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const setLoginMessage = useAccountsStore((state) => state.setLoginMessage)
    const { 
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<InputTypes>();

    useEffect(() => {
        if (!isAuthenticated) {
            return router.replace("/");
        }
    }, [isAuthenticated, router])

    const onSubmit: SubmitHandler<InputTypes>  = async(data) => {
        if (data.newPassword !== data.confirmPassword) {
            setError("confirmPassword", { message: "رمزهای عبور مطابقت ندارند." });
            return;
        }
        try {
            await axios.put(
                INTERNAL_API, data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            setLoginMessage("رمز عبور شما با موفقیت تغییر یافت,لطفا مجددا وارد شوید.");
            await logout();
            return router.replace("/accounts/login/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError("oldPassword", {message: "رمز عبور قبلی صحیح نیست."});
            } else {
                setError("root", { message: "مشکلی در سرور بوجود آمده است." })
            }
        }
    };

    return (
        <div className="relative w-screen h-screen flex items-center justify-center">
            <span className="absolute top-36 left-5 min-[440px]:left-20 min-[560px]:left-36 min-[680px]:left-56 min-[860px]:left-72 min-[990px]:left-96 min-[1150px]:left-auto bg-gradient-to-bl from-sky-200 via-sky-500 to-sky-950 shadow-lg w-28 h-28 rounded-full"></span>

            <div className="relative z-20 w-64 bg-white/30 border-b-2 border-r-2 border-sky-500/20 backdrop-blur-lg rounded-3xl flex flex-col items-center p-4">
                <h1 className="text-sky-600 text-lg">تغییر رمز عبور</h1>
                <form className="flex flex-col gap-7 pt-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sky-600">رمز عبور قبلی</label>
                        <input {...register("oldPassword", { 
                        required: "لطفا رمز عبور قبلی خود را وارد کنید."
                    })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" dir="ltr" type="password" placeholder="********" />
                    {errors.oldPassword && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.oldPassword.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sky-600">رمز عبور جدید</label>
                        <input {...register("newPassword", { 
                        required: "لطفا رمز عبور جدید خود را وارد کنید.",
                        minLength: {
                            value: 8,
                            message: "رمز عبور جدید باید حداقل هشت حرف باشد."
                        }
                    })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" type="password" placeholder="********" dir="ltr" />
                    {errors.newPassword && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.newPassword.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sky-600">تکرار رمز عبور</label>
                        <input {...register("confirmPassword", {
                        required: "لطفا رمز عبور خود را تکرار کنید."
                    })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" type="password" placeholder="********" dir="ltr" />
                    </div>
                    {errors.confirmPassword && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.confirmPassword.message}</span>}
                    <button disabled={isSubmitting} type="submit" className="bg-gradient-to-l text-white from-sky-500 via-sky-700 to-sky-950 rounded-md p-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "تغییر رمز عبور"}</button>
                </form>
            </div>
        </div>
    )
};

export default Page;