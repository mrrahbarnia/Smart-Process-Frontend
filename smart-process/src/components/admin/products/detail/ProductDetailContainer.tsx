"use client"
import { useState, Fragment } from "react";
import { RiToolsLine } from "react-icons/ri";
import { TbFileDescription } from "react-icons/tb";
import { MdBalance } from "react-icons/md";
import { BiCalendar } from "react-icons/bi";
import { MdDiscount } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useAdminGetProductDetail from "@/hooks/useQueries/useAdminGetProductDetail";
import useGetComments from "@/hooks/useQueries/useGetComments";
import ImageSliderModal from "./ImageSliderModal";
import Image from "next/image";
import TimeAgo from 'react-time-ago';
import fa from 'javascript-time-ago/locale/fa.json';
import TimeAgoModule from 'javascript-time-ago';
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

TimeAgoModule.addDefaultLocale(fa);

const ProductDetailContainer = ({productSerial}: {productSerial: string}) => {
    const [showComments, setShowComments] = useState<boolean>(false);
    const [showImageSlider, setShowImageSlider] = useState<boolean>(false);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();
    const {
        productData,
        productIsError,
        productIsPending
    } = useAdminGetProductDetail(productSerial);
    const {commentsData, commentsIsPending} = useGetComments(productData?.id || "", showComments);

    if (productIsError) {
        logout();
        return router.replace("/accounts/login/")
    }

    if (productIsPending) {
        return <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-12 h-12 m-auto flex items-center justify-center" />
    }

    const showCommentsHandler = () => {
        setShowComments(true);
    }

    if (commentsData) {
        commentsData.forEach(comment => {
            console.log(comment.createdAt);
        })
    }

    return (
        <Fragment>
            
            {/* Image Slider Modal */}
            {productData && showImageSlider && <ImageSliderModal 
                                                    closeModalHandler={setShowImageSlider}
                                                    productName={productData.name}
                                                    imageUrls={productData.imageUrls}
                                                />}

            <div className="flex flex-col items-center gap-1 border-2 rounded-md border-blue-300 bg-blue-50 py-3 w-full min-[615px]:w-2/3 px-2 mx-2 my-16 min-[615px]:mx-auto">
                {productData && <Image onClick={() => setShowImageSlider(true)} className="cursor-zoom-in rounded-md object-fill h-60" src={productData.imageUrls[0]} height={500} width={500} alt={`${productData.name} image`} />}
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <GiMoneyStack size={18} />
                            <p>قیمت(ریال)</p>
                        </div>
                        <span>{productData?.price}</span>
                    </div>
                    <hr className="border-gray-300"/>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <MdBalance size={16} />
                            <p>موجودی</p>
                        </div>
                        <span>{productData?.stock}</span>
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
                        <span>{productData?.expiryDiscount}</span>
                    </div>
                </div>
                <hr className="border-gray-300 w-full"/>
                <div className="flex flex-col w-full lg:w-2/3  mb-2">
                    <div className="flex items-center gap-1">
                        <RiToolsLine size={18} />
                        <h3>ویژگی های محصول</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        {productData && Object.entries(productData?.attributeValues).map(([key, value]) => {
                            return (
                                <div className="flex items-center justify-between w-full mx-auto bg-blue-200 rounded-md p-1" key={key}>
                                    <p>{key}</p>
                                    <p>{value}</p>
                                </div>
                            )
                        }) }
                    </div>
                </div>
                <hr className="border-gray-300 w-full"/>
                {showComments ? <span className="bg-blue-100 mt-1 text-blue-800 rounded-md text-sm p-1">نظرات</span> : <button onClick={showCommentsHandler} className="bg-blue-100 mt-1 text-blue-800 rounded-md text-sm p-1 hover:bg-blue-200 transition-colors duration-300">مشاهده نظرات</button>}
                {showComments && commentsIsPending && (
                    <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-6 h-6 m-auto" />
                )}
                {showComments && commentsData && (
                    commentsData.length === 0 ? (
                        <p className="tex-sm rounded-md text-red-800 bg-red-200 p-1">برای این محصول نظری ثبت نشده است.</p>
                    ) : (
                        <div className="flex flex-col w-full lg:w-2/3 gap-3 mt-2">
                            {commentsData.map((comment) => (
                                <div key={comment.id} className="flex flex-col bg-white rounded-md p-1 gap-1">
                                    <h3>{comment.username}</h3>
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
