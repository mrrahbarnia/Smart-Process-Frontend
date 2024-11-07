"use client"
import { RxCross1, RxUpdate } from "react-icons/rx";
// import UpdateModal from "./UpdateModal";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";
import { ProductType } from "@/hooks/useQueries/useAdminGetAllProducts";
import useActivateProduct from "@/hooks/useMutations/useActiveProduct";
import useDeactivateProduct from "@/hooks/useMutations/useDeactiveProduct";
import { useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "./DeleteModal";


const ProductItem = (props: {product: ProductType}) => {
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const {deactivateMutate} = useDeactivateProduct();
    const {activateMutate} = useActivateProduct();

    const deactivateHandler = (id: string) => {
        deactivateMutate(id);
    }

    const activateHandler = (id: string) => {
        activateMutate(id);
    }

    return (
        <Fragment>

            {/* Delete Modal */}
            {showDeleteModal && <DeleteModal productId={props.product.id} closeModalHandler={setShowDeleteModal} />}

            {/* Update Modal */}
            {/* {showUpdateModal && <UpdateModal closeModalHandler={setShowUpdateModal} brand={props.brand} />} */}

            <Link href={`/admin/products/${props.product.serialNumber}/`} className="relative border-2 rounded-md border-blue-300 bg-blue-50 flex flex-col gap-2 w-full items-center hover:bg-blue-100 active:bg-blue-100 transition-colors duration-300 py-1">
                <div className={`absolute right-1 top-1 rounded-md p-1 ${props.product.isActive ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                    {props.product.isActive ? <AiOutlineCheck /> : <RxCross1 />}
                </div>
                <p className="text-lg text-blue-900 font-[YekanBakh-SemiBold]" dir="rtl">{props.product.name}</p>
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
                            <span>{props.product.price}</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex items-center justify-between">
                            <p>موجودی</p>
                            <span>{props.product.stock}</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex items-center justify-between">
                            <p>تخفیف(درصد)</p>
                            <span>{props.product.discount}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-4">
                    <button onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setShowDeleteModal(true)
                    }} className="bg-red-100 p-1 rounded-md text-red-800 hover:bg-red-200 transition-colors duration-300">
                        <AiOutlineDelete size={20}/>
                    </button>
                    <button onClick={(e) => {
                        e.stopPropagation()
                        setShowUpdateModal(true)
                    }} className="bg-yellow-100 p-1 rounded-md text-yellow-700 hover:bg-yellow-200 transition-colors duration-300">
                        <RxUpdate size={18} />
                    </button>
                    {props.product.isActive && <button onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        deactivateHandler(props.product.id)
                    }} className="text-xs bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-300 p-1 rounded-md">
                        غیرفعال کردن
                    </button>}
                    {!props.product.isActive && <button onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        activateHandler(props.product.id)
                    }} className="text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-300 p-1 rounded-md">
                        فعال کردن
                    </button>}
                </div>
            </Link>
            {showUpdateModal || showDeleteModal ? <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div> : undefined}
        </Fragment>
    )
};

export default ProductItem;
