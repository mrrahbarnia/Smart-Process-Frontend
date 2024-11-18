"use client"
import axios from "axios";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";
import { calculateDays } from "@/utils/calculateDays";
import Link from "next/link";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/inquiry-guaranty/`

type InputTypes = {
    serialNumber: string
}

type responseType = {
    productSerialNumber: string,
    guarantySerial: string,
    productName: string,
    guarantyDays: number,
    producedAt: string
}


const Page = () => {
    const [responseData, setResponseData] = useState<responseType>();
    const { 
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<InputTypes>();

    const onSubmit: SubmitHandler<InputTypes>  = async(data) => {
        try {
            const response = await axios.get<responseType>(`${EXTERNAL_API}/${data.serialNumber}/`)
            setResponseData(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data && error.response?.data.detail === "There is no guaranty with the provided info!") {
                    setError("serialNumber", { message: "این کالا مشمول گارانتی پردازش هوشمند نمیباشد.☹️ " })
                    setResponseData(undefined);
                }
            } else {
                setError("serialNumber", { message: "مشکلی در سرور بوجود آمده است." })
                setResponseData(undefined);
            }
        }
    };

    let remainGuarantyDays;
    if (responseData) {
        remainGuarantyDays = responseData.guarantyDays - calculateDays(responseData.producedAt.split(" ")[0]);
    }

    return (
        <div className="flex flex-col justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                <h1 className="text-center text-xl text-blue-900 font-[YekanBakh-Black]">فرم استعلام گارانتی محصول</h1>
                <div className="flex flex-col gap-1">
                    <label>شماره سریال گارانتی</label>
                    <input {...register("serialNumber", { 
                        required: "شماره سریال گارانتی را وارد کنید.",
                    })} type="text" className="h-9 rounded-md px-2" dir="ltr" />
                    {errors.serialNumber && <div className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">
                        <span className="block">این کالا مشمول گارانتی پردازش هوشمند نمیباشد. ☹️</span>
                        <span className="block">در صورتی که نیاز به کمک یا راهنمایی دارید با ما تماس بگیرید.🙂</span>
                    </div>}
                </div>
                <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "استعلام"}</button>
                {responseData && <div className="bg-violet-800 rounded-md">
                <ul className="p-2 flex flex-col gap-2 text-white">
                    <li>شماره سریال محصول:{responseData.guarantySerial}</li>
                    <hr/>
                    <li>مدل محصول:{responseData.productName}</li>
                    <hr/>
                    {remainGuarantyDays && <li className="text-sm">
                        {remainGuarantyDays > 0 ? `خوشحالیم که تا ${remainGuarantyDays} روز دیگر کالای شما نزد ما گارانتی دارد.🙂` : remainGuarantyDays <= 0 ? "متأسفانه گارانتی این کالا به پایان رسیده است.🙁" : undefined}
                        {remainGuarantyDays <= 0 && <span className="block">ولی نگران نباشید، هنوز هم اگر کمکی از دستمان بر بیاد با کمال میل برایتان انجام میدهیم.🙂</span>}
                    </li>}
                    <hr/>
                    <li className="text-center underline-offset-2 underline">
                        <Link href={`/products/${responseData.productSerialNumber}`}>صفحه محصول شما</Link>
                    </li>
                </ul>
            </div>}
            </form>
        </div>
    )
};

export default Page;
