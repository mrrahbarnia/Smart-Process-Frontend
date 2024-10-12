"use client"
import { RxCross1, RxUpdate } from "react-icons/rx";
import UpdateModal from "./UpdateModal";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";
import { categoryType } from "@/hooks/useQueries/useGetAllCategories";
import useDeactivateCategory from "@/hooks/useMutations/useDeativateCategory";
import useActivateCategory from "@/hooks/useMutations/useActiveCategory";
import { useState, Fragment } from "react";
import DeleteModal from "./DeleteModal";


const CategoryItem = (props: {category: categoryType}) => {
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const {deactivateMutate} = useDeactivateCategory();
    const {activateMutate} = useActivateCategory();

    const deactivateHandler = (id: number) => {
        deactivateMutate(id);
    }

    const activateHandler = (id: number) => {
        activateMutate(id);
    }

    return (
        <Fragment>

            {/* Delete Modal */}
            {showDeleteModal && <DeleteModal categoryId={props.category.id} closeModalHandler={setShowDeleteModal} />}

            {/* Update Modal */}
            {showUpdateModal && <UpdateModal closeModalHandler={setShowUpdateModal} category={props.category} />}

            <div className="relative border-2 rounded-md border-blue-300 bg-blue-50 flex flex-col gap-2 h-28 w-full items-center">
                <div className={`absolute right-1 top-1 rounded-md p-1 ${props.category.isActive ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                    {props.category.isActive ? <AiOutlineCheck /> : <RxCross1 />}
                </div>
                <p className="text-base " dir="rtl">دسته بندی:{props.category.name}</p>
                <hr className="border-1 border-gray-300 w-2/3"/>
                <span className={`text-white text-sm w-fit py-1 px-2 rounded-md text-right ${props.category.parentName ? "bg-green-600" : "bg-red-600"}`} dir="rtl">{props.category.parentName ? `دسته بندی والد:${props.category.parentName}` : "دسته بندی والد ندارد."}</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowDeleteModal(true)} className="bg-red-100 p-1 rounded-md text-red-800 hover:bg-red-200 transition-colors duration-300">
                        <AiOutlineDelete size={20}/>
                    </button>
                    <button onClick={() => setShowUpdateModal(true)} className="bg-yellow-100 p-1 rounded-md text-yellow-700 hover:bg-yellow-200 transition-colors duration-300">
                        <RxUpdate size={18} />
                    </button>
                    {props.category.isActive && <button onClick={() => deactivateHandler(props.category.id)} className="text-xs bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-300 p-1 rounded-md">
                        غیرفعال کردن
                    </button>}
                    {!props.category.isActive && <button onClick={() => activateHandler(props.category.id)} className="text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-300 p-1 rounded-md">
                        فعال کردن
                    </button>}
                </div>
            </div>
            {showUpdateModal || showDeleteModal ? <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div> : undefined}
        </Fragment>
    )
};

export default CategoryItem;