"use client"
import { useState, Fragment } from "react";
import { RiAccountCircleFill, RiToolsLine } from "react-icons/ri";
import { AiOutlineDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import { TbFileDescription } from "react-icons/tb";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdBalance, MdDiscount } from "react-icons/md";
import { useRouter } from "next/navigation";
import { BiCalendar } from "react-icons/bi";
import { useAuthStore } from "@/store/useAuthStore";
import { GiMoneyStack } from "react-icons/gi";
import useGetProductDetail from "@/hooks/useQueries/useGetProductDetail";
import useGetComments from "@/hooks/useQueries/useGetComments";
import ImageSliderModal from "@/components/admin/products/detail/ImageSliderModal";
import Image from "next/image";
import TimeAgo from 'react-time-ago';
import fa from 'javascript-time-ago/locale/fa.json';
// @ts-expect-error Package doesnt have type interface
import jalaali from "jalaali-js";
import TimeAgoModule from 'javascript-time-ago';
import { useCreateComment } from "@/hooks/useMutations/useCreateComment";

TimeAgoModule.addDefaultLocale(fa);

type CommentInputType = {
    message: string
}

const ProductDetailContainer = ({productSerial}: {productSerial: string}) => {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [showImageSlider, setShowImageSlider] = useState<boolean>(false);
    const {
        productData,
        productIsError,
        productIsPending
    } = useGetProductDetail(productSerial);
    const {commentsData, commentsIsPending} = useGetComments(productData?.id || "", showComments);
    const {createIsPending, createMutateAsync} = useCreateComment();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitSuccessful }
    } = useForm<CommentInputType>();

    let discountExpiryJalaliDate = "";

    if (productData) {
        const [year, month, day] = productData.expiryDiscount.split('-').map(Number);
        const jalaliDateObj = jalaali.toJalaali(year, month, day);
        discountExpiryJalaliDate = `${jalaliDateObj.jy}/${jalaliDateObj.jm}/${jalaliDateObj.jd}` 
    }

    if (productIsError) {
        // return <h1>Not Found</h1>
    }

    if (productIsPending) {
        return <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-12 h-12 m-auto flex items-center justify-center" />
    }

    const showCommentsHandler = () => {
        setShowComments(true);
    }

    const onSubmit: SubmitHandler<CommentInputType> = async(data) => {
        createMutateAsync({productId: productData?.id as string, message: data.message})
        .then(() => {
            setValue("message", "");
        })
        .catch((error) => {
            if (error.status === 403) {
                logout();
                return router.replace("/accounts/login/")
            }
        })
    };

    const productValidAttributes = productData && Object.entries(productData.attributeValues)
    .filter(([, value]) => value != null && value != undefined && value != "")

    return (
        <Fragment>
            {/* Image Slider Modal */}
            {productData && showImageSlider && <ImageSliderModal 
                                                    closeModalHandler={setShowImageSlider}
                                                    productName={productData.name}
                                                    imageUrls={productData.imageUrls}
                                                />}

            <div className="flex flex-col items-center gap-1 border-2 rounded-md border-blue-300 bg-blue-50 py-3 w-full min-[615px]:w-2/3 px-2 mx-2 my-32 min-[615px]:mx-auto">
                {productData && <Image onClick={() => setShowImageSlider(true)} className="cursor-zoom-in rounded-md object-contain bg-white h-60" src={productData.imageUrls[0]} height={500} width={500} alt={`${productData.name} image`} />}
                <h1 className="text-left w-full lg:w-2/3  font-bold text-lg">{productData?.name}</h1>
                <h2 className="text-left w-full lg:w-2/3  text-gray-500 text-sm">{productData?.serialNumber}</h2>
                <div className="flex items-center justify-between w-full lg:w-2/3 text-xs bg-gray-50 rounded-md px-1 text-blue-800">
                    <h3>دسته بندی:<span className="text-lg">{productData?.categoryName}</span></h3>
                    <h3>برند:<span className="text-lg">{productData?.brandName}</span></h3>
                </div>
                <div className="flex flex-col w-full lg:w-2/3  items-start pt-3">
                    <div className="flex items-center gap-1">
                        <TbFileDescription size={18} />
                        <h3>توضیحات</h3>
                    </div>
                    <p className="text-xs text-gray-500">{productData?.description}</p>
                </div>
                <hr className="border-gray-300 w-full"/>
                <div className="text-xs w-full bg-gray-200 lg:w-2/3  flex flex-col gap-1 rounded-md mx-auto p-1 my-3 ">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <GiMoneyStack size={18} />
                                <p>قیمت(ریال)</p>
                            </div>
                            <span className={`${productData?.priceAfterDiscount && "line-through decoration-red-600"}`}>{productData?.price}</span>
                        </div>
                        {productData?.priceAfterDiscount && <div className="flex items-center justify-between bg-green-100 rounded-md text-green-900 p-1">
                            <p>با احتساب تخفیف</p>
                            <span>{productData.priceAfterDiscount}</span>
                        </div>}
                    </div>
                    <hr className="border-gray-300"/>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <MdDiscount size={16} />
                            <p>تخفیف(درصد)</p>
                        </div>
                        <span>{productData?.discount}</span>
                    </div>
                    <hr className="border-gray-300"/>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <BiCalendar size={16} />
                            <p>تاریخ انقضای تخفیف</p>
                        </div>
                        {discountExpiryJalaliDate && <span>{discountExpiryJalaliDate}</span>}
                    </div>
                    <hr className="border-gray-300"/>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <MdBalance size={16} />
                            <p>موجودی</p>
                        </div>
                        <span>{productData?.stock}</span>
                    </div>
                </div>
                <hr className="border-gray-300 w-full"/>
                <div className="flex flex-col w-full lg:w-2/3  mb-2">
                    <div className="flex items-center gap-1">
                        <RiToolsLine size={18} />
                        <h3>ویژگی های محصول</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        {productValidAttributes && productValidAttributes.length === 0 ? <p className="text-xs rounded-md text-red-800 bg-red-200 p-1 w-fit mx-auto">محصول ویژگی ندارد.</p> : productValidAttributes && productValidAttributes
                        .map(([key, value]) => {
                            return (
                                <div className="flex items-center justify-between w-full mx-auto bg-sky-300 rounded-md p-1" key={key}>
                                    <p>{key}</p>
                                    <p>{value}</p>
                                </div>
                            )
                        }) }
                    </div>
                </div>
                <hr className="border-gray-300 w-full"/>
                {isAuthenticated && <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-blue-800" >لطفا نظر خود را برای ما ثبت کنید.</label>
                        <textarea rows={4} className="rounded-md text-sm border-blue-100 px-2 resize-none p-1" {...register("message", {
                            required: "لطفا نظر خود را بنویسید."
                        })} />
                        {errors.message && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{errors.message.message}</span>}
                    </div>
                    {isSubmitSuccessful && <p className="bg-green-700 text-white px-2 py-1 rounded-md text-xs">از شما ممنونیم که تجربیات خود را با دیگران به اشتراک میگذارید.</p>}
                    <button disabled={createIsPending} className="bg-blue-100 text-blue-800 rounded-md duration-300 hover:bg-blue-200 transition-colors p-1" type="submit">{createIsPending ? <AiOutlineLoading3Quarters className="mx-auto"/> : "ثبت"}</button>
                </form>}
                <hr className="border-gray-300 w-full"/>
                {showComments ? <span className="bg-blue-100 mt-1 text-blue-800 rounded-md text-sm p-1">نظرات</span> : <button onClick={showCommentsHandler} className="bg-blue-100 mt-1 text-blue-800 rounded-md text-sm p-1 hover:bg-blue-200 transition-colors duration-300">مشاهده نظرات</button>}
                {showComments && commentsIsPending && (
                    <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-6 h-6 m-auto" />
                )}
                {showComments && commentsData && (
                    commentsData.length === 0 ? (
                        <p className="text-xs rounded-md text-red-800 bg-red-200 p-1">برای این محصول نظری ثبت نشده است.</p>
                    ) : (
                        <div className="flex flex-col w-full lg:w-2/3 gap-3 mt-2">
                            {commentsData.map((comment) => (
                                <div key={comment.id} className="flex flex-col bg-white rounded-md p-1 gap-1">
                                    <div className="flex gap-1">
                                        <RiAccountCircleFill size={18} />
                                        <h3>{comment.username}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500">{comment.message}</p>
                                    <hr className="border-gray-300" />
                                    <TimeAgo className="text-xs" date={comment.createdAt} locale="fa" />
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
            {showImageSlider && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
        </Fragment>
    )
};

export default ProductDetailContainer;
