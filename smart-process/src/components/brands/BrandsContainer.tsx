"use client"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BrandList from "./BrandList";
import useGetActiveBrands from "@/hooks/useQueries/useGetActiveBrands";

const BrandsContainer = () => {
    const {
        brandsData,
        brandsIsPending
    } = useGetActiveBrands();

    if (brandsIsPending) {
        return <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-12 h-12 m-auto pt-28" />
    }

    return (
        <div className="w-full flex flex-col gap-4 min-h-screen px-2 md:px-6 min-[950px]:px-40 pt-28">
            {brandsData && <BrandList brands={brandsData}/>}
        </div>
    )
};

export default BrandsContainer;