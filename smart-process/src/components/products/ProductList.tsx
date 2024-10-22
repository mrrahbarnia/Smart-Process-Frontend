"use client"
import { ProductType } from "@/hooks/useQueries/useGetActiveProducts";
import ProductItem from "./ProductItem";

const ProductList = (props: {products: ProductType[]}) => {
    return (
        <div className="flex flex-col gap-8 pt-4 w-full min-[500px]:w-[460px] mx-auto">
            {props.products.map(product => <ProductItem key={product.id} product={product} />)}
        </div>
    )
};

export default ProductList;