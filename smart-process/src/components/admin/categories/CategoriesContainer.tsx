"use client"
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { categoryType } from "@/hooks/useQueries/useGetAllCategories";
import CategoryList from "./CategoryList";

type propsType = {
    categories: categoryType[] | undefined,
    categoriesCount: number | undefined,
    isPending: boolean | undefined,
    isError: boolean | undefined
}

const CategoryContainer = (props: propsType) => {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    if (props.isError) {
        logout();
        router.replace("/accounts/login/");
    }

    if (props.isPending) {
        return <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-12 h-12 m-auto" />
    }


    return (
        <div className="w-full flex flex-col gap-4 px-2 md:px-6 min-[950px]:px-40 pt-16">
            <h1 className="text-center text-lg">مدیریت دسته بندی ها</h1>
            <div className="text-sm bg-blue-300 rounded-md p-1 flex items-center justify-between">
                <div className="text-green-900 flex items-center gap-1 bg-green-200 cursor-pointer hover:bg-green-300 rounded-md px-2 py-1 transition-colors duration-300">
                    <AiOutlinePlusCircle size={20} />
                    <span>افزودن</span>
                </div>
                <span>تعداد دسته بندی ها: {props.categoriesCount}</span>
            </div>
            {props.categories && <CategoryList categories={props.categories}/>}
        </div>
    )
};

export default CategoryContainer;