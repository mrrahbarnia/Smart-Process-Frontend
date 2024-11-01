"use client"
import { RxUpdate } from "react-icons/rx";
import { AiFillPlusCircle } from "react-icons/ai";
import { CgPlayListSearch, CgTimelapse } from "react-icons/cg";
import { AiFillStar } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";
import { FaHashtag } from "react-icons/fa";
import { Fragment, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from "next/link";
import { AiOutlineDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import useGetArticleDetail from "@/hooks/useQueries/useGetArticleDetail";
import useGetArticleComments from "@/hooks/useQueries/useGetArticleComments";
import Image from "next/image";
import TimeAgo from 'react-time-ago';
import fa from 'javascript-time-ago/locale/fa.json';
import { useAdminDeleteArticleComment } from "@/hooks/useMutations/useAdminDeleteArticleComment";
import TimeAgoModule from 'javascript-time-ago';
import { useDeleteGlossary } from "@/hooks/useMutations/useDeleteGlossary";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import useGetGlossaries from "@/hooks/useQueries/useGetGlossaries";
import { RiAccountCircleFill } from "react-icons/ri";
import CreateGlossaryModal from "../CreateGlossaryModal";
import UpdateGlossaryModal from "./UpdateGlossaryModal";
import { GlossaryType } from "@/hooks/useQueries/useGetGlossaries";

TimeAgoModule.addDefaultLocale(fa);

function StarRating({ rating }: {rating: number}) {
    return (
        <div className="flex">
        {Array.from({ length: 5 }, (_, index) => (
            <AiFillStar
            key={index}
            size={20}
            color={index < rating ? '#ffc133' : 'gray'}
            className="mr-1"
            />
        ))}
        </div>
    );
}

const ArticleDetailContainer = ({articleId}: {articleId: string}) => {
    const [showComments, setShowComments] = useState<boolean>(false);
    const [showCreateGlossaryModal, setShowCreateGlossaryModal] = useState<boolean>(false);
    const [showGlossaries, setShowGlossaries] = useState<boolean>(false);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();
    const [isFetchGlossaries, setIsFetchGlossaries] = useState<boolean>(false);
    const {glossariesData, glossariesIsPending} = useGetGlossaries({articleId: articleId}, isFetchGlossaries);
    const {
        articleData,
        // articleIsError,
        articleIsPending
    } = useGetArticleDetail(articleId);
    const {commentsData, commentsIsPending} = useGetArticleComments(articleId, showComments);
    const {deleteMutateAsync} = useDeleteGlossary();
    const {deleteMutate} = useAdminDeleteArticleComment();
    const [showUpdateGlossaryModal, setShowUpdateGlossaryModal] = useState<boolean>(false);
    const [selectedGlossary, setSelectedGlossary] = useState<GlossaryType>({
        id: 1,
        term: "",
        definition: ""
    });

    // if (articleIsError) {
    //     logout();
    //     return router.replace("/accounts/login/")
    // }

    if (articleIsPending) {
        return <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-12 h-12 m-auto flex items-center justify-center" />
    }

    const showCommentsHandler = () => setShowComments(true);

    const deleteHandler = (glossaryId: number) => {
        deleteMutateAsync({glossaryId: glossaryId})
        .catch(error => {
            if (error.status === 403) {
                logout();
                return router.replace("/accounts/login/")
            }
        })
    }

    return (
        <Fragment>

            {/* Update glossary Modal */}
            {showUpdateGlossaryModal && <UpdateGlossaryModal glossary={selectedGlossary} closeModalHandler={setShowUpdateGlossaryModal} />}

            {/* Delete Modal */}
            {showCreateGlossaryModal && <CreateGlossaryModal articleId={articleId} closeModalHandler={setShowCreateGlossaryModal} />}

            <div className={`relative flex flex-col items-center gap-3 border-2 rounded-md border-blue-300 bg-blue-50 py-3 w-full min-[615px]:w-2/3 px-2 mx-2 my-16 min-[615px]:mx-auto`}>
                <div className="absolute right-1 top-1 flex items-center gap-1">
                    <button onClick={() => {
                        setIsFetchGlossaries(true)
                        setShowGlossaries(true)
                    }} className="flex items-center gap-1 text-xs bg-sky-200 rounded-md text-sky-900 p-1">
                        <CgPlayListSearch size={20} />
                        پاورقی
                    </button>
                    <AiFillPlusCircle onClick={() => setShowCreateGlossaryModal(true)} size={20} color="green" className="cursor-pointer"/>
                </div>
                
                {articleData && <div className="absolute left-1 top-1 flex items-center gap-1 bg-sky-200 rounded-md text-sky-900 p-1">
                    <CgTimelapse size={13} />
                    <TimeAgo className="text-xs" date={articleData.createdAt} locale="fa" />
                </div>}
                <h1 className="text-lg text-blue-900">{articleData?.title}</h1>
                <Swiper
                    navigation
                    pagination={{type: "fraction"}}
                    modules={[Navigation, Pagination]}
                    className='max-h-96 w-full rounded-lg'
                >
                    {articleData?.images.map((imageUrl) => (
                        <SwiperSlide key={imageUrl}>
                            <div className='flex h-full w-full items-center justify-center'>
                                <Image
                                    className="object-cover"
                                    width={500} height={500} 
                                    src={imageUrl} alt={`${articleData.title} image`}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="w-full flex items-center justify-between">
                    {articleData?.averageRating && <StarRating rating={Math.floor(articleData.averageRating)} />}
                    {articleData && articleData.tags[0] !== null && <div className="flex items-center gap-1 flex-wrap">
                        {articleData.tags.map(tag => <Link href={`/admin/articles?tag_name=${tag}`} key={tag} className="flex items-center bg-sky-200 hover:bg-sky-300 transition-colors duration-300 text-sky-900 rounded-md p-1 text-xs">
                            <FaHashtag size={13} />
                            <span>{tag}</span>
                        </Link>)}
                    </div>}
                </div>

                <div className="flex flex-col items-start gap-1 px-2 py-1 bg-blue-100 rounded-md m-2">
                    <div className="flex items-center gap-1 text-blue-900">
                        <HiDocumentText size={20} />
                        <h2>توضیحات</h2>
                    </div>
                    <p className="text-xs text-gray-500 leading-5">{articleData?.description}</p>
                </div>
                {showComments ? <span className="bg-blue-100 mt-1 text-blue-800 rounded-md text-sm p-1">نظرات</span> : <button onClick={showCommentsHandler} className="bg-blue-100 mt-1 text-blue-800 rounded-md text-sm p-1 hover:bg-blue-200 transition-colors duration-300">مشاهده نظرات</button>}
                {showComments && commentsIsPending && (
                    <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-6 h-6 m-auto" />
                )}
                {showComments && commentsData && (
                    commentsData.length === 0 ? (
                        <p className="text-xs rounded-md text-red-800 bg-red-200 p-1">برای این مقاله نظری ثبت نشده است.</p>
                    ) : (
                        <div className="flex flex-col w-full lg:w-2/3 gap-3 mt-2">
                            {commentsData.map((comment) => (
                                <div key={comment.id} className="relative flex flex-col bg-white rounded-md p-1 gap-1">
                                    <button onClick={() => deleteMutate({id: comment.id})} className="absolute left-1 top-1 p-1 rounded-md bg-red-50 text-red-800 hover:bg-red-200 transition-colors duration-300">
                                        <AiOutlineDelete size={15}/>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        <RiAccountCircleFill size={18} />
                                        <h3>{comment.username}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500">{comment.message}</p>
                                    <hr className="border-gray-300" />
                                    <TimeAgo className="text-xs" date={comment.createdAt} locale="fa" />
                                </div>
                            ))}
                        </div>
                    )
                )}

                <div className={`overflow-y-scroll absolute z-10 top-0 w-full backdrop-blur-md transform transition-transform duration-500 ${showGlossaries ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                    <div className="w-full p-4"> {/* Added background color to prevent blur */}
                        <button
                            onClick={() => setShowGlossaries(false)}
                            className="absolute right-2 top-2 text-sm hover:text-red-600"
                        >
                            X
                        </button>
                        {glossariesIsPending && <AiOutlineLoading3Quarters className="mx-auto animate-spin" />}
                        <ul className="flex flex-col gap-2 pt-4">
                            {glossariesData?.map(glossary => <li className="bg-gray-200 p-2 rounded-md relative" key={glossary.id}>
                                <div className="absolute left-1 top-1 flex items-center gap-1">
                                    <button onClick={() => deleteHandler(glossary.id)} className="p-1 rounded-md bg-red-50 text-red-800 hover:bg-red-200 transition-colors duration-300">
                                        <AiOutlineDelete size={15}/>
                                    </button>
                                    <button onClick={() => {
                                        setShowUpdateGlossaryModal(true)
                                        setSelectedGlossary(glossary)
                                    }} className="bg-yellow-100 p-1 rounded-md text-yellow-700 hover:bg-yellow-200 transition-colors duration-300">
                                        <RxUpdate size={15} />
                                    </button>
                                </div>
                                <h2 className="text-md text-blue-900">{glossary.term}</h2>
                                <hr className="border-gray-400 py-1"/>
                                <p className="text-xs text-gray-700">{glossary.definition}</p>
                            </li>)}
                        </ul>
                    </div>
                </div>
            </div>
            {showCreateGlossaryModal || showUpdateGlossaryModal ? <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div> : undefined}
            
        </Fragment>
    )
};

export default ArticleDetailContainer;
