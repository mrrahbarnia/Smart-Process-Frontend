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
        user_rule: "user" | "admin"
    },
    phoneNumber: string
}

const Page = () => {
    const router = useRouter();
    const setLoginMessage = useAccountsStore((state) => state.setLoginMessage);
    const loginMessage = useAccountsStore((state) => state.loginMessage);
    const login = useAuthStore((state) => state.login);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setRule = useAuthStore((state) => state.setRule);
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
            setRule(response.data.deserializedToken.user_rule);
            setPhoneNumber(response.data.phoneNumber);
            return router.replace("/");
        } catch {
            setError("root", { message: "حساب کاربری فعالی با مشخصات وارد شده یافت نشد." })
        }
    };

    return (
        <Fragment>
            {loginMessage && <p className="bg-gradient-to-l from-green-900 via-green-700 to-green-500 text-white text-xs pr-1 pb-2 pt-14 ">{loginMessage}</p>}
            <div className="flex justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                    <h1 className="text-center text-xl">فرم ورود</h1>
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
                        <label>رمز عبور</label>
                        <input {...register("password", {
                            required: "لطفا رمز عبور خود را وارد کنید."
                        })} type="password" className="h-9 rounded-md px-2" placeholder="12345678" dir="ltr" />
                        {errors.password && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.password.message}</span>}
                    </div>
                    {errors.root && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.root.message}</span>}
                    <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "ورود"}</button>
                    <Link className="mx-auto text-sm underline underline-offset-4 hover:text-blue-800 transition duration-200" href="/accounts/register/">حساب کاربری ندارید؟</Link>
                </form>
            </div>
        </Fragment>
    )
};

export default Page;