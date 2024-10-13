"use client"
import { BrandType } from "@/hooks/useQueries/useGetAllBrands";
import BrandItem from "./BrandItem";

const BrandList = (props: {brands: BrandType[]}) => {
    return (
        <div className="flex flex-col gap-8 pt-4 w-full min-[500px]:w-[460px] mx-auto">
            {props.brands.map(brand => <BrandItem key={brand.slug} brand={brand} />)}
        </div>
    )
};

export default BrandList;