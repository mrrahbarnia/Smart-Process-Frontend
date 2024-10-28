"use client"
import { useEffect, Fragment } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAccountsStore } from "@/store/useAccountsStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const INTERNAL_API = "/apis/accounts/login/";

type InputTypes = {
    phoneNumber: string,
    password: string
}

type responseType = {
    deserializedToken: {
        user_role: "user" | "admin"
    },
    phoneNumber: string
}

const Page = () => {
    const router = useRouter();
    const setLoginMessage = useAccountsStore((state) => state.setLoginMessage);
    const loginMessage = useAccountsStore((state) => state.loginMessage);
    const login = useAuthStore((state) => state.login);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setRole = useAuthStore((state) => state.setRole);
    const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);
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
    }, [isAuthenticated, loginMessage, router])

    useEffect(() => {
        if (loginMessage) {
            const id = setTimeout(() => {
                setLoginMessage("");
            }, 5000)
    
            return () => clearTimeout(id);
        }
    }, [loginMessage, setLoginMessage])

    const onSubmit: SubmitHandler<InputTypes>  = async(data) => {
        try {
            const response = await axios.post<responseType>(INTERNAL_API, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            login();
            setRole(response.data.deserializedToken.user_role);
            setPhoneNumber(response.data.phoneNumber);
            return router.replace("/");
        } catch {
            setError("root", { message: "حساب کاربری فعالی با مشخصات وارد شده یافت نشد." })
        }
    };

    return (
        <Fragment>
            {loginMessage && <p className="bg-gradient-to-l from-green-900 via-green-700 to-green-500 text-white text-xs pr-1 pb-2 pt-14 ">{loginMessage}</p>}
            <div className="relative w-screen h-screen flex items-center justify-center">
                <span className="absolute top-36 left-5 min-[440px]:left-20 min-[560px]:left-36 min-[680px]:left-56 min-[860px]:left-72 min-[990px]:left-96 min-[1150px]:left-auto bg-gradient-to-bl from-sky-200 via-sky-500 to-sky-950 shadow-lg w-28 h-28 rounded-full"></span>

                <div className="relative z-20 w-64 bg-white/30 border-b-2 border-r-2 border-sky-500/20 backdrop-blur-lg rounded-3xl flex flex-col items-center p-4">
                    <h1 className="text-sky-600 text-lg">فرم ورود</h1>
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
                            <label className="text-sky-600">رمز عبور</label>
                            <input {...register("password", { 
                            required: "لطفا رمز عبور خود را وارد کنید.",
                        })} className="h-7 p-2 rounded-md bg-transparent border border-sky-600 outline-none" type="password" placeholder="********" dir="ltr" />
                        {errors.password && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.password.message}</span>}
                        </div>
                        {errors.root && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.root.message}</span>}
                        <button disabled={isSubmitting} type="submit" className="bg-gradient-to-l text-white from-sky-500 via-sky-700 to-sky-950 rounded-md p-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "ورود"}</button>
                        <div className="flex flex-col items-center">
                            <p className="text-xs">حساب کاربری ندارید؟</p>
                            <Link className="text-sm underline underline-offset-4 text-sky-700 decoration-sky-400" href="/accounts/register/">ثبت نام</Link>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>


    )
};

export default Page;