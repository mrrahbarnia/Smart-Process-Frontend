"use client"
import { RxCross2 } from "react-icons/rx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";
import useGetCatAttributes from "@/hooks/useQueries/useGetCatAttributes";
import useUnassignCatAttr from "@/hooks/useMutations/useUnassignCatAttr";


const AllAttributesModal = (
    {categoryId, categoryName, closeModalHandler}:
    {categoryId: number, categoryName: string, closeModalHandler: Dispatch<SetStateAction<boolean>>}
) => {
    const {
        catAttributesData,
        catAttributesIsPending
    } = useGetCatAttributes({categoryName: categoryName});
    const {
        unassignMutate
    } = useUnassignCatAttr();

    const deleteHandler = (attribute: string) => {
        unassignMutate({categoryId: categoryId, attributeName: attribute})
    };

    return (
        <div className="px-5 bg-gradient-to-b from-blue-100 to-blue-200 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
            <div className="w-full flex flex-col gap-2 bg-gray-100 rounded-md p-1">
                {catAttributesIsPending ? <AiOutlineLoading3Quarters className="mx-auto animate-spin" /> :
                catAttributesData?.length === 0 ? <p className="text-sm text-red-600">هنوز ویژگی وصل نشده است.</p> :
                catAttributesData?.map((attribute) => {
                    return (
                        <div key={attribute} className="text-sm flex justify-between bg-gray-300 rounded-md py-1 px-2">
                            <p className="text-blue-800">{attribute}</p>
                            <RxCross2 onClick={() => deleteHandler(attribute)} size={18} className="text-red-400 hover:text-red-800 cursor-pointer transition-colors duration-300" />
                        </div>
                    )
                })}
            </div>
            <button type="button" className="bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200 transition-colors duration-300" onClick={() => closeModalHandler(false)}>بستن</button>
        </div>
    )
};

export default AllAttributesModal;
