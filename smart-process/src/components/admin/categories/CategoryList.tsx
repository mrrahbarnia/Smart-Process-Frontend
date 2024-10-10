"use client"
import { categoryType } from "@/hooks/useQueries/useGetAllCategories";
import CategoryItem from "./CategoryItem";

const CategoryList = (props: {categories: categoryType[]}) => {
    return (
        <div className="flex flex-col gap-8 pt-4 w-full min-[500px]:w-[460px] mx-auto">
            {props.categories.map(category => <CategoryItem key={category.id} category={category} />)}
        </div>
    )
};

export default CategoryList;