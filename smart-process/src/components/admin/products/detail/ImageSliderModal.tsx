"use client"
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const ImageSliderModal = (
    {closeModalHandler, imageUrls, productName}:
    {closeModalHandler: Dispatch<SetStateAction<boolean>>, imageUrls: string[], productName: string}
) => {
    return (
        <div className="h-screen w-full z-50 overflow-scroll fixed right-0 top-0 mt-10">
            <div className="rounded-lg px-1 pb-16 w-full mx-auto my-10 relative">
                <button onClick={() => closeModalHandler(false)} className="text-red-600 bg-white py-2 px-4 active:bg-red-600 active:text-white hover:bg-red-600 hover:text-white rounded-full absolute right-4 top-4 font-bold">X</button>
                <div className="flex flex-col pt-14 gap-3">
                    <Swiper
                        navigation
                        pagination={{type: "fraction"}}
                        modules={[Navigation, Pagination]}
                        className='max-h-96 w-full rounded-lg'
                    >
                        {imageUrls.map((imageUrl) => (
                            <SwiperSlide key={imageUrl}>
                                <div className='flex h-full w-full items-center justify-center'>
                                    <Image
                                        className="object-cover"
                                        width={500} height={500} 
                                        src={imageUrl} alt={`${productName} image`}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
};

export default ImageSliderModal;