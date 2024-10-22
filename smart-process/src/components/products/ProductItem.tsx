"use client"
import { ProductType } from "@/hooks/useQueries/useGetActiveProducts";
import Image from "next/image";
import Link from "next/link";


const ProductItem = (props: {product: ProductType}) => {

    return (
        <Link href={`/products/${props.product.serialNumber}/`} className="border-2 rounded-md border-blue-300 bg-blue-50 flex flex-col gap-2 w-full items-center hover:bg-blue-100 active:bg-blue-100 transition-colors duration-300 py-1">
            <p className="text-base " dir="rtl">{props.product.name}</p>
            <hr className="border-1 border-gray-300 w-2/3"/>
            <div className="flex gap-1 w-full px-1">
                <Image width={250} height={250} className="w-44 h-28 object-fill rounded-md" src={props.product.imageUrl} alt={`${props.product.name} image`} />
                <div className="flex flex-col gap-1 text-xs w-full">
                    <div className="flex items-center justify-between">
                        <p>کد محصول</p>
                        <span>{props.product.serialNumber}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex items-center justify-between">
                        <p>دسته بندی</p>
                        <span>{props.product.categoryName}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex items-center justify-between">
                        <p>برند</p>
                        <span>{props.product.brandName}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex items-center justify-between">
                        <p>قیمت(ریال)</p>
                        <span className={`${props.product.priceAfterDiscount && "line-through decoration-red-600"}`}>{props.product.price}</span>
                    </div>
                    {props.product.priceAfterDiscount && <div className="flex items-center justify-between bg-green-100 rounded-md text-green-900 p-1">
                        <p>با احتساب تخفیف</p>
                        <span >{props.product.priceAfterDiscount}</span>
                    </div>}
                    <hr className="border-gray-300" />
                    <div className="flex items-center justify-between">
                        <p>موجودی</p>
                        <span>{props.product.stock}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
};

export default ProductItem;
