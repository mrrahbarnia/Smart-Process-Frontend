"use client"
import { FaEye } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import useGetNewestArticles from "@/hooks/useQueries/useGetNewestArticles";
import useGetMostViewedArticles from "@/hooks/useQueries/useGetMostViewedArticles";
import useGetPopularArticles from "@/hooks/useQueries/useGetPopularArticles";
import Link from "next/link";
import TimeAgo from 'react-time-ago';
import fa from 'javascript-time-ago/locale/fa.json';
import TimeAgoModule from 'javascript-time-ago';
import { CgTimelapse } from "react-icons/cg";
import StarRating from "@/utils/showArticleRating";
import useGetNewestProducts from "@/hooks/useQueries/useGetNewestProducts";
import useGetMostViewedProducts from "@/hooks/useQueries/useGetMostViewedProducts";

TimeAgoModule.addDefaultLocale(fa);


const MainPage = () => {
    const {
        mostViewedProductsData,
        mostViewedProductsIsPending
    } = useGetMostViewedProducts();
    const {
        newestProductsData,
        newestProductsIsPending
    } = useGetNewestProducts();
    const {
        mostViewedArticlesData,
        mostViewedArticlesIsPending
    } = useGetMostViewedArticles();
    const {
        newestArticlesData,
        newestArticlesIsPending
    } = useGetNewestArticles();
    const {
        popularArticlesData,
        popularArticlesIsPending
    } = useGetPopularArticles();


    return (
        <div className="flex flex-col gap-10">
            
            {/* Banner Image */}
            <Image 
                width={1920}
                height={600}
                className="mt-12 w-full min-h-60 sm:max-h-96 md:max-h-[450px] lg:max-h-[600px]"
                src={"/images/main-banner.jpg"}
                alt="banner image"
            />

            {/* Newest Products */}
            {newestProductsIsPending && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />}
            <div className="flex flex-col items-start gap-1 p-3 w-full">
                <h2 className="font-[YekanBakh-Bold] md:font-[YekanBakh-Black] text-xl text-blue-900">جدیدترین محصولات</h2>
                {newestProductsData && <div className="flex items-center p-2 gap-3 overflow-x-auto w-full">
                    {newestProductsData.map(product =>
                        <Link href={`/products/${product.serialNumber}/`} key={product.serialNumber} className="group hover:scale-105 transition-transform duration-300 flex flex-col gap-2 w-64 md:w-80 h-52 md:h-56 flex-shrink-0 bg-gradient-to-bl from-blue-300 via-blue-200 to-blue-50 rounded-md p-2">
                            <h3 className="font-[YekanBakh-SemiBold] text-sm">{product.name}</h3>
                            <div className="w-full bg-white rounded-md">
                                <Image className="w-40 mx-auto h-32 md:h-36" src={product.image} alt={`${product.name} image`} height={500} width={500} />
                            </div>
                            <div className="flex items-center gap-1 bg-blue-100 p-1 rounded-md text-sky-900">
                                <CgTimelapse size={15} className="group-hover:animate-spin" />
                                <TimeAgo className="text-xs" date={product.createdAt} locale="fa" />
                            </div>
                        </Link>
                    )}
                </div>}
            </div>

            {/* Most Viewed Products */}
            {mostViewedProductsIsPending && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />}
            <div className="flex flex-col items-start gap-1 p-3 w-full">
                <h2 className="font-[YekanBakh-Bold] md:font-[YekanBakh-Black] text-xl text-blue-900">پربازدیدترین محصولات</h2>
                {mostViewedProductsData && <div className="flex items-center p-2 gap-3 overflow-x-auto w-full">
                    {mostViewedProductsData.map(product =>
                        <Link href={`/products/${product.serialNumber}/`} key={product.serialNumber} className="hover:scale-105 transition-transform duration-300 flex flex-col gap-2 w-64 md:w-80 h-48 md:h-52 flex-shrink-0 bg-gradient-to-bl from-blue-300 via-blue-200 to-blue-50 rounded-md p-2">
                            <h3 className="font-[YekanBakh-SemiBold] text-sm">{product.name}</h3>
                            <div className="relative">
                                <div className="w-full bg-white rounded-md">
                                    <Image className="w-40 mx-auto h-32 md:h-36" src={product.image} alt={`${product.name} image`} height={500} width={500} />
                                </div>
                                <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-blue-200 rounded-md p-1 text-blue-900">
                                    <FaEye size={15} />
                                    <span>{product.views}</span>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>}
            </div>

            {/* Newest Articles */}
            {newestArticlesIsPending && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />}
            <div className="flex flex-col items-start gap-1 p-3 w-full">
                <h2 className="font-[YekanBakh-Bold] md:font-[YekanBakh-Black] text-xl text-blue-900">جدیدترین مقالات</h2>
                {newestArticlesData && <div className="flex items-center p-2 gap-3 overflow-x-auto w-full">
                    {newestArticlesData.map(article =>
                        <Link href={`/articles/${article.id}/`} key={article.id} className="group hover:scale-105 transition-transform duration-300 flex flex-col gap-2 w-64 md:w-80 h-56 md:h-60 flex-shrink-0 bg-gradient-to-bl from-blue-300 via-blue-200 to-blue-50 rounded-md p-2">
                            <h3 className="font-[YekanBakh-SemiBold] text-sm">{article.title}</h3>
                            <Image className="rounded-md w-full h-32 md:h-36" src={article.image} alt={`${article.title} image`} height={500} width={500} />
                            <div className="flex items-center gap-1 bg-blue-100 p-1 rounded-md text-sky-900">
                                <CgTimelapse size={15} className="group-hover:animate-spin" />
                                <TimeAgo className="text-xs" date={article.createdAt} locale="fa" />
                            </div>
                        </Link>
                    )}
                </div>}
            </div>

            {/* Most Viewed Articles */}
            {mostViewedArticlesIsPending && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />}
            <div className="flex flex-col items-start gap-1 p-3 w-full">
                <h2 className="font-[YekanBakh-Bold] md:font-[YekanBakh-Black] text-xl text-blue-900">پربازدیدترین مقالات</h2>
                {mostViewedArticlesData && <div className="flex items-center p-2 gap-3 overflow-x-auto w-full">
                    {mostViewedArticlesData.map(article =>
                        <Link href={`/articles/${article.id}/`} key={article.id} className="hover:scale-105 transition-transform duration-300 flex flex-col gap-2 w-64 md:w-80 h-48 md:h-52 flex-shrink-0 bg-gradient-to-bl from-blue-300 via-blue-200 to-blue-50 rounded-md p-2">
                            <h3 className="font-[YekanBakh-SemiBold] text-sm">{article.title}</h3>
                            <div className="relative">
                                <Image className="rounded-md w-full h-32 md:h-36" src={article.image} alt={`${article.title} image`} height={500} width={500} />
                                <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-blue-200 rounded-md p-1 text-blue-900">
                                    <FaEye size={15} />
                                    <span>{article.views}</span>
                                </div>
                            </div>
                            
                        </Link>
                    )}
                </div>}
            </div>

            {/* Popular Articles */}
            {popularArticlesIsPending && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />}
            <div className="flex flex-col items-start gap-1 p-3 w-full">
                <h2 className="font-[YekanBakh-Bold] md:font-[YekanBakh-Black] text-xl text-blue-900">محبوبترین مقالات</h2>
                {popularArticlesData && <div className="flex items-center p-2 gap-3 overflow-x-auto w-full">
                    {popularArticlesData.map(article =>
                        <Link href={`/articles/${article.id}/`} key={article.id} className="hover:scale-105 transition-transform duration-300 flex flex-col gap-2 w-64 md:w-80 h-48 md:h-52 flex-shrink-0 bg-gradient-to-bl from-blue-300 via-blue-200 to-blue-50 rounded-md p-2">
                            <h3 className="font-[YekanBakh-SemiBold] text-sm">{article.title}</h3>
                            <div className="relative">
                                <Image className="rounded-md w-full h-32 md:h-36" src={article.image} alt={`${article.title} image`} height={500} width={500} />
                                <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-blue-200 rounded-md p-1 text-blue-900">
                                    <StarRating rating={Math.floor(Number(article.averageRating))} />
                                </div>
                            </div>
                        </Link>
                    )}
                </div>}
            </div>

        </div>
    );
};

export default MainPage;