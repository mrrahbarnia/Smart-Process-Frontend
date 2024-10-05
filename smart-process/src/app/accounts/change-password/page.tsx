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
        <div className="flex justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                <h1 className="text-center text-xl">فرم تغییر رمز عبور</h1>
                <div className="flex flex-col gap-1">
                    <label>رمز عبور قبلی</label>
                    <input {...register("oldPassword", { 
                        required: "لطفا رمز عبور قبلی خود را وارد کنید."
                    })} type="password" className="h-9 rounded-md px-2" dir="ltr" />
                    {errors.oldPassword && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.oldPassword.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>رمز عبور جدید</label>
                    <input {...register("newPassword", { 
                        required: "لطفا رمز عبور جدید خود را وارد کنید.",
                        minLength: {
                            value: 8,
                            message: "رمز عبور جدید باید حداقل هشت حرف باشد."
                        }
                    })} type="password" className="h-9 rounded-md px-2" dir="ltr"/>
                    {errors.newPassword && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.newPassword.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>تکرار رمز عبور</label>
                    <input {...register("confirmPassword", {
                        required: "لطفا رمز عبور خود را تکرار کنید."
                    })} type="password" className="h-9 rounded-md px-2" dir="ltr" />
                    {errors.confirmPassword && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.confirmPassword.message}</span>}
                </div>
                <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "تغییر رمز عبور"}</button>
            </form>
        </div>
    )
};

export default Page;