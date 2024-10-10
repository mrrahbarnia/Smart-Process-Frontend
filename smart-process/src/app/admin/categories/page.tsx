"use client"
import useGetAllCategories from "@/hooks/useQueries/useGetAllCategories";
import CategoryContainer from "@/components/admin/categories/CategoriesContainer";

const Page = () => {
    const {
        categoriesCount,
        categoriesData,
        categoriesIsError,
        categoriesIsPending
    } = useGetAllCategories();
    

    return (
        <CategoryContainer
            categories={categoriesData}
            categoriesCount={categoriesCount}
            isError={categoriesIsError}
            isPending={categoriesIsPending}
        />
    )
};

export default Page;