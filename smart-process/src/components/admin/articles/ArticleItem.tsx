"use client"
import { TbCodePlus } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { CgTimelapse } from "react-icons/cg";
import { HiDocumentText } from "react-icons/hi";
import { RxUpdate } from "react-icons/rx";
// import UpdateModal from "./UpdateModal";
import AddTagModal from "../attributes/AddTagModal";
import { ArticleType } from "@/hooks/useQueries/useGetAllArticles";
import { useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import TimeAgo from 'react-time-ago';
import TimeAgoModule from 'javascript-time-ago';
import fa from 'javascript-time-ago/locale/fa.json';
import useUnassignTags from "@/hooks/useMutations/useUnassignTags";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import DeleteModal from "./DeleteModal";

TimeAgoModule.addDefaultLocale(fa);

const ArticleItem = (props: {article: ArticleType}) => {
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showAssignTagModal, setShowAssignTagModal] = useState<boolean>(false);
    const {unassignMutateAsync} = useUnassignTags();
    const logout = useAuthStore(state => state.logout)
    const router = useRouter();

    const unassignHandler = (tagName: string | null) => {
        if (tagName) {
            unassignMutateAsync({articleId: props.article.id, tagName: tagName})
            .catch(() => {
                logout();
                return router.replace("/accounts/login/")
            })
        }
    }

    return (
        <Fragment>

            {/* Delete Modal */}
            {showDeleteModal && <DeleteModal articleId={props.article.id} closeModalHandler={setShowDeleteModal} />}

            {/* Update Modal */}
            {/* {showUpdateModal && <UpdateModal closeModalHandler={setShowUpdateModal} tag={props.tag} />} */}

            {/* Add Tag Modal */}
            {showAssignTagModal && <AddTagModal articleId={props.article.id} closeModalHandler={setShowAssignTagModal} />}

            <Link href="#" className="relative border-2 rounded-md border-blue-300 bg-blue-50 hover:bg-blue-100 active:bg-blue-100 transition-colors duration-300 flex flex-col gap-2 w-full items-center">
                <div className="absolute left-1 top-1 flex items-center gap-1 bg-sky-200 rounded-md text-sky-900 p-1">
                    <CgTimelapse size={13} />
                    <TimeAgo className="text-xs" date={props.article.createdAt} locale="fa" />
                </div>
                <h2 className="text-base " dir="rtl">{props.article.title}</h2>
                <hr className="border-1 border-gray-300 w-2/3"/>
                <Image width={500} height={500} className="w-72 h-40 object-fill rounded-md" src={props.article.image} alt={`${props.article.title} image`} />
                {props.article.tags[0] !== null && <div className="flex items-center gap-3">
                    {props.article.tags.map(tag => <div key={tag} className="relative">
                        <span onClick={() => unassignHandler(tag)} className="absolute -top-2 -left-1 text-red-500 text-sm hover:scale-150 transition-transform duration-300">x</span>
                        <Link className="bg-sky-200 hover:bg-sky-300 transition-colors duration-300 text-sky-900 rounded-md p-1 text-xs"  href="#">{tag}</Link>
                    </div>)}
                </div>}
                <div className="flex flex-col items-start gap-1 px-2 py-1 bg-blue-100 rounded-md m-2">
                    <div className="flex items-center gap-1">
                        <HiDocumentText size={20} />
                        <h2>توضیحات</h2>
                    </div>
                    <p className="text-gray-600 text-xs">{props.article.description}</p>
                </div>
                <div className="flex items-center gap-2 py-1">
                    <button onClick={() => setShowDeleteModal(true)} className="bg-red-100 p-1 rounded-md text-red-800 hover:bg-red-200 transition-colors duration-300">
                        <AiOutlineDelete size={20}/>
                    </button>
                    <button onClick={() => setShowUpdateModal(true)} className="bg-yellow-100 p-1 rounded-md text-yellow-700 hover:bg-yellow-200 transition-colors duration-300">
                        <RxUpdate size={18} />
                    </button>
                    <div onClick={() => setShowAssignTagModal(true)} className="flex items-center text-sm bg-green-100 p-1 rounded-md text-green-800 hover:bg-green-200 transition-colors duration-300">
                        <TbCodePlus size={20} />
                        <p>تگ جدید</p>
                    </div>
                </div>
            </Link>
            {showAssignTagModal || showUpdateModal || showDeleteModal ? <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div> : undefined}
        </Fragment>
    )
};

export default ArticleItem;
