"use client"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import useGetNewestArticles from "@/hooks/useQueries/useGetNewestArticles";
import Link from "next/link";
import TimeAgo from 'react-time-ago';
import fa from 'javascript-time-ago/locale/fa.json';
import TimeAgoModule from 'javascript-time-ago';
import { CgTimelapse } from "react-icons/cg";



TimeAgoModule.addDefaultLocale(fa);

const MainPage = () => {
    const {
        newestArticlesData,
        newestArticlesIsPending
    } = useGetNewestArticles();

    if (newestArticlesData) {
        console.log(newestArticlesData);
    }

    return (
        <div className="flex flex-col gap-2">
            {/* md:max-h-[600px] */}
            <Image 
                width={1920}
                height={600}
                className="mt-12 w-full min-h-60 sm:max-h-96 md:max-h-[450px] lg:max-h-[600px]"
                src={"/images/main-banner.jpg"}
                alt="banner image"
            />
            {newestArticlesIsPending && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />}
            {newestArticlesData && <div className="flex flex-col items-start gap-1 p-3 w-full">
                <h2 className="font-[YekanBakh-Bold] md:font-[YekanBakh-Black] text-xl text-blue-900">جدیدترین مقالات</h2>
                <div className="flex items-center p-2 gap-3 overflow-x-auto w-full">
                    {newestArticlesData.map(article =>
                        <Link href={`/articles/${article.id}/`} key={article.id} className="group hover:scale-105 transition-transform duration-300 flex flex-col gap-2 w-64 md:w-80 h-56 md:h-60 flex-shrink-0 bg-gradient-to-bl from-blue-300 via-blue-200 to-blue-50 rounded-md p-2">
                            <h3 className="font-[YekanBakh-SemiBold] text-md">{article.title}</h3>
                            <Image className="rounded-md w-full h-32 md:h-36" src={article.image} alt={`${article.title} image`} height={500} width={500} />
                            <div className="flex items-center gap-1 bg-blue-100 p-1 rounded-md text-sky-900">
                                <CgTimelapse size={15} className="group-hover:animate-spin" />
                                <TimeAgo className="text-xs" date={article.createdAt} locale="fa" />
                            </div>
                            
                        </Link>
                    )}
                </div>
                

            </div>}
        </div>
    );
};

export default MainPage;