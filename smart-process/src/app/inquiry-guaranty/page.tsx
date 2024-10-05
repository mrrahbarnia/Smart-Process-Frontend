"use client"
import axios from "axios";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/products/inquiry-guaranty`

type InputTypes = {
    serialNumber: string
}

type responseType = {
    productSerialNumber: string,
    guarantySerial: string,
    productName: string,
    dateOfDocument: string
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
            const response = await axios.get<responseType>(`${EXTERNAL_API}/${data.serialNumber}`)
            setResponseData(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data && error.response?.data.detail === "There is no guaranty with the provided info!") {
                    setError("serialNumber", { message: "اطلاعاتی با شماره سریال وارد شده موجود نمیباشد." })
                    setResponseData(undefined);
                }
            } else {
                setError("serialNumber", { message: "مشکلی در سرور بوجود آمده است." })
                setResponseData(undefined);
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                <h1 className="text-center text-xl">فرم استعلام گارانتی محصول</h1>
                <div className="flex flex-col gap-1">
                    <label>شماره سریال گارانتی</label>
                    <input {...register("serialNumber", { 
                        required: "شماره سریال گارانتی را وارد کنید.",
                    })} type="text" className="h-9 rounded-md px-2" dir="ltr" />
                    {errors.serialNumber && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.serialNumber.message}</span>}
                </div>
                <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin" /> : "استعلام"}</button>
                {responseData && <div className="bg-violet-800 rounded-md">
                <ul className="p-2 flex flex-col gap-2 text-white">
                    <li>شماره سریال محصول:{responseData.productSerialNumber}</li>
                    <hr/>
                    <li>شماره سریال گارانتی:{responseData.guarantySerial}</li>
                    <hr/>
                    <li>محصول:{responseData.productName}</li>
                    <hr/>
                    <li>تاریخ سند:{responseData.dateOfDocument.split(" ")[0]}</li>
                </ul>
            </div>}
            </form>
        </div>
    )
};

export default Page;