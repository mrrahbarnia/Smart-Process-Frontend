"use client"
import { ImWarning } from "react-icons/im";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";
import { useDeleteArticle } from "@/hooks/useMutations/useDeleteArticle";
import { useAuthStore } from "@/store/useAuthStore";


const DeleteModal = ({articleId, closeModalHandler}: {articleId: string, closeModalHandler: Dispatch<SetStateAction<boolean>>}) => {
    const {deleteIsPending, deleteMutateAsync} = useDeleteArticle();
    const logout = useAuthStore((state) => state.logout);

    const deleteHandler = () => {
        deleteMutateAsync({id: articleId})
        .then(() => closeModalHandler(false))
        .catch(() => {
            logout();
            closeModalHandler(false);
        })
    }

    return (
        <div className="bg-gradient-to-b from-blue-100 to-blue-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
            <div className="flex items-center gap-1 bg-red-100 text-red-800 rounded-md p-1">
                <ImWarning />
                <p>مطمئن هستید؟</p>
            </div>
            <div className="flex items-center gap-2">
                <button className="bg-green-50 text-green-600 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200 transition-colors duration-300" onClick={() => closeModalHandler(false)}>خیر</button>
                <button disabled={deleteIsPending} onClick={deleteHandler} className="bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200 transition-colors duration-300">{deleteIsPending ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "بله" }</button>
            </div>
        </div>
    )
};

export default DeleteModal;