"use client"
import { BrandType } from "@/hooks/useQueries/useGetActiveBrands";
import Link from "next/link";


const BrandItem = (props: {brand: BrandType}) => {

    return (
        <Link href={`/products?nameContain=&brandExact=${props.brand.name}&categoryExact=`} className="relative border-2 rounded-md border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors duration-300 flex flex-col gap-2 h-auto p-2 w-full items-center">
            <h2 className="text-base text-sky-700" dir="rtl">{props.brand.name}</h2>
            <hr className="border-1 border-gray-300 w-2/3"/>
            <p className="text-xs text-gray-700">{props.brand.description}</p>
        </Link>
    )
};

export default BrandItem;