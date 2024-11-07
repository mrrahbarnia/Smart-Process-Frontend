"use client"
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { EXTERNAL_BASE_ENDPOINT } from "@/configs/default";

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/tickets/create-ticket/`;

type InputTypes = {
    name: string,
    productSerial: string,
    phoneNumber: string,
    guarantyRating: number,
    repairsRating: number,
    notificationRating: number,
    personalBehaviorRating: number,
    servicesRating: number,
    smartProcessRating: number,
    criticism: string,
    callRequest: boolean
}

const Page = () => {
    const { 
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting, isSubmitSuccessful }
    } = useForm<InputTypes>({
        defaultValues: {
            callRequest: false
        }
    });

    const onSubmit: SubmitHandler<InputTypes>  = async(data) => { 
        if (data.callRequest && !data.phoneNumber) {
            return setError("callRequest", { message: "اگر تمایل دارید با شما تماس بگیریم لطفا شماره موبایل خود را وارد کنید." });
        }
        
        try {
            await axios.post(
                EXTERNAL_API, data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                setError("root", { message: "فرم با موفقیت ارسال نشد,لطفا دوباره تلاش کنید." })
            } else {
                setError("root", { message: "مشکلی در سرور بوجود آمده است." })
            }
        }
    };

    return (
        <div className="flex justify-center items-center w-5/6 min-[490px]:w-3/4 min-[600px]:w-3/5 min-[860px]:w-2/4 mx-auto py-36">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-6 bg-gradient-to-b from-blue-100 to-blue-300 w-full rounded-md shadow-lg">
                <h1 className="text-center text-xl text-blue-900 font-[YekanBakh-Black]">فرم نظر سنجی و شکایات</h1>
                <div className="flex flex-col gap-1">
                    <label>نام و نام خانوادگی \ نام شرکت<span className="text-red-600">*</span></label>
                    <input {...register("name", { 
                        required: "لطفا نام خود یا شرکت خود را وارد کنید.",
                        maxLength: {
                            value: 200,
                            message: "نام نباید بیشتر از دویست حرف باشد."
                        }
                    })} type="text" className="h-9 rounded-md px-2"/>
                    {errors.name && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.name.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>شماره موبایل</label>
                    <input {...register("phoneNumber")} type="text" className="h-9 rounded-md px-2" placeholder="0913*******" dir="ltr" />
                    {errors.phoneNumber && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.phoneNumber.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>شماره سریال کالا</label>
                    <input {...register("productSerial", {
                        maxLength: {
                            value: 100,
                            message: "طول شماره سریال کالا نباید بیشتر از صد تا باشد."
                        }
                    })} type="text" className="h-9 rounded-md px-2" dir="ltr" />
                    {errors.productSerial && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.productSerial.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="guaranty-rating" className="text-xs" >از دسترسی یا سهولت ارتباط با بخشهای پشتیبانی و گارانتی ما چقدر رضایت دارید؟<span className="text-red-600">*</span></label>
                    <div className="flex justify-between items-center bg-blue-100 rounded-md px-1">
                        <label className="flex items-center gap-1">
                            <input {...register("guarantyRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="5" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">عالیه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("guarantyRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="4" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">خوبه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("guarantyRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="3" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">متوسط</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("guarantyRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="2" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">کمی</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("guarantyRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="1" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">اصلا</span>
                        </label>
                    </div>
                    {errors.guarantyRating && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.guarantyRating.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="repairs-rating" className="text-xs" >از میزان زمان سپری شده جهت تعمیرات و تحویل مجدد کالا چقدر رضایت داشتید؟<span className="text-red-600">*</span></label>
                    <div className="flex justify-between bg-blue-100 items-center rounded-md px-1">
                        <label className="flex items-center gap-1">
                            <input {...register("repairsRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="5" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">عالیه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("repairsRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="4" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">خوبه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("repairsRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="3" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">متوسط</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("repairsRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="2" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">کمی</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("repairsRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="1" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">اصلا</span>
                        </label>
                    </div>
                    {errors.repairsRating && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.repairsRating.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="notification-rating" className="text-xs" >از اطلاع رسانی یا سهولت پیگیری برای تعمیر دستگاهتان چقدر رضایت دارید؟<span className="text-red-600">*</span></label>
                    <div className="flex justify-between bg-blue-100 items-center rounded-md px-1">
                        <label className="flex items-center gap-1">
                            <input {...register("notificationRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="5" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">عالیه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("notificationRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="4" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">خوبه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("notificationRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="3" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">متوسط</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("notificationRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="2" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">کمی</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("notificationRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="1" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">اصلا</span>
                        </label>
                    </div>
                    {errors.notificationRating && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.notificationRating.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="personal-behavior-rating" className="text-xs" >از رفتار و برخورد پرسنل به چه میزان رضایت دارید؟<span className="text-red-600">*</span></label>
                    <div className="flex justify-between bg-blue-100 items-center rounded-md px-1">
                        <label className="flex items-center gap-1">
                            <input {...register("personalBehaviorRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="5" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">عالیه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("personalBehaviorRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="4" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">خوبه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("personalBehaviorRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="3" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">متوسط</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("personalBehaviorRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="2" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">کمی</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("personalBehaviorRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="1" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">اصلا</span>
                        </label>
                    </div>
                    {errors.personalBehaviorRating && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.personalBehaviorRating.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="services-rating" className="text-xs" >از کیفیت خدمات دریافتی چقدر رضایت دارید؟<span className="text-red-600">*</span></label>
                    <div className="flex justify-between bg-blue-100 items-center rounded-md px-1">
                        <label className="flex items-center gap-1">
                            <input {...register("servicesRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="5" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">عالیه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("servicesRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="4" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">خوبه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("servicesRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="3" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">متوسط</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("servicesRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="2" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">کمی</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("servicesRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="1" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">اصلا</span>
                        </label>
                    </div>
                    {errors.servicesRating && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.servicesRating.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="smart-process-rating" className="text-xs" >در کل از گارانتی و خدمات پشتیبانی پردازش هوشمند چقدر رضایت داشتید؟<span className="text-red-600">*</span></label>
                    <div className="flex justify-between bg-blue-100 items-center rounded-md px-1">
                        <label className="flex items-center gap-1">
                            <input {...register("smartProcessRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="5" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">عالیه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("smartProcessRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="4" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">خوبه</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("smartProcessRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="3" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">متوسط</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("smartProcessRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="2" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">کمی</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input {...register("smartProcessRating", {
                                required: "لطفا یک گزینه را انتخاب کنید.",
                            })} type="radio" value="1" className="h-9 rounded-md px-2"/>
                            <span className="text-xs">اصلا</span>
                        </label>
                    </div>
                    {errors.smartProcessRating && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.smartProcessRating.message}</span>}
                </div>
                
                <div className="flex flex-col gap-1 text-sm">
                    <label>برای ارائه بهتر خدمات از سوی این شرکت چه پیشنهاد، انتقاد یا شکایتی دارید؟<span className="text-red-600">*</span></label>
                    <textarea className="rounded-md resize-none p-2" rows={6} {
                        ...register("criticism", { required: "لطفا شکایات,پیشنهادات یا انتقادات خود را وارد کنید."})
                    } />
                    {errors.criticism && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.criticism.message}</span>}
                </div>


                <div className="flex flex-col gap-1">
                    <label htmlFor="call-request" className="text-xs">چنانچه لازم میبینید ما با شما تماس بگیریم لطفا به ما اطلاع دهید.</label>

                    <div className="flex flex-col bg-blue-100 items-center rounded-md px-1">
                        <label className="flex items-center gap-1">
                            <input 
                                {...register("callRequest")}
                                type="radio" value="true" className="h-9 rounded-md px-2"
                            />
                            <span className="text-xs">حتما با من تماس بگیرید</span>
                        </label>
                    </div>
                    {errors.callRequest && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.callRequest.message}</span>}
                </div>
                {errors.root && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.root.message}</span>}
                {isSubmitSuccessful && <span className="bg-green-700 text-white text-sm px-2 py-1 rounded-md">نظر شما با موفقیت ثبت شد.</span>}
                <button disabled={isSubmitting} className="hover:bg-blue-200 transition duration-200 w-1/3 mx-auto rounded-md py-1">{isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "ارسال"}</button>
            </form>
        </div>
    )
};

export default Page;