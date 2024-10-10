"use client"
import { RxUpdate } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import { categoryType } from "@/hooks/useQueries/useGetAllCategories";

const CategoryItem = (props: {category: categoryType}) => {
    return (
        <div className="border-2 rounded-md border-blue-300 bg-blue-50 flex flex-col gap-2 h-28 w-full items-center">
            <p className="text-base " dir="rtl">دسته بندی:{props.category.name}</p>
            <hr className="border-1 border-gray-300 w-2/3"/>
            <span className={`text-white text-sm w-fit py-1 px-2 rounded-md text-right ${props.category.parentName ? "bg-green-600" : "bg-red-600"}`} dir="rtl">{props.category.parentName ? `دسته بندی والد:${props.category.parentName}` : "دسته بندی والد ندارد."}</span>
            <div className="flex items-center gap-2">
                <button className="bg-red-100 p-1 rounded-md text-red-800 hover:bg-red-200 transition-colors duration-300">
                    <AiOutlineDelete size={20}/>
                </button>
                <button className="bg-yellow-100 p-1 rounded-md text-yellow-700 hover:bg-yellow-200 transition-colors duration-300">
                    <RxUpdate size={18} />
                </button>
            </div>
        </div>
    )
};

export default CategoryItem;