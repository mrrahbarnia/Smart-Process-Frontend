"use client"
import { RxUpdate } from "react-icons/rx";
import UpdateModal from "./UpdateModal";
import { AiOutlineDelete } from "react-icons/ai";
import { TagType } from "@/hooks/useQueries/useGetAllTags";
import { useState, Fragment } from "react";
import DeleteModal from "./DeleteModal";


const TagItem = (props: {tag: TagType}) => {
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    
    return (
        <Fragment>

            {/* Delete Modal */}
            {showDeleteModal && <DeleteModal tagName={props.tag.name} closeModalHandler={setShowDeleteModal} />}

            {/* Update Modal */}
            {showUpdateModal && <UpdateModal closeModalHandler={setShowUpdateModal} tag={props.tag} />}

            <div className="border-2 rounded-md border-blue-300 bg-blue-50 flex flex-col gap-2 h-24 w-full items-center">
                <p className="text-base " dir="rtl">تگ:{props.tag.name}</p>
                <hr className="border-1 border-gray-300 w-2/3"/>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowDeleteModal(true)} className="bg-red-100 p-1 rounded-md text-red-800 hover:bg-red-200 transition-colors duration-300">
                        <AiOutlineDelete size={20}/>
                    </button>
                    <button onClick={() => setShowUpdateModal(true)} className="bg-yellow-100 p-1 rounded-md text-yellow-700 hover:bg-yellow-200 transition-colors duration-300">
                        <RxUpdate size={18} />
                    </button>
                </div>
            </div>
            {showUpdateModal || showDeleteModal ? <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div> : undefined}
        </Fragment>
    )
};

export default TagItem;