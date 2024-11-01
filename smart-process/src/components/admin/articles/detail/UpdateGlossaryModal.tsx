"use client"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUpdateGlossary } from "@/hooks/useMutations/useUpdateGlossary";
import { GlossaryType } from "@/hooks/useQueries/useGetGlossaries";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

type InputTypes = {
    term: string,
    definition: string
}


const UpdateGlossaryModal = ({glossary, closeModalHandler}: {glossary: GlossaryType, closeModalHandler: Dispatch<SetStateAction<boolean>>}) => {
    const logout = useAuthStore(state => state.logout);
    const router = useRouter();
    const {updateIsPending, updateMutateAsync} = useUpdateGlossary();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<InputTypes>({
        defaultValues: {
            term: glossary.term,
            definition: glossary.definition
        }
    })

    const onSubmit: SubmitHandler<InputTypes> = (data) => {        
        updateMutateAsync({glossaryId: glossary.id, data: data})
        .then(() => {
            closeModalHandler(false);
        })
        .catch((error) => {
            console.log(error);
            if (error.response && error.response.data?.detail === 'Term and article_id are unique together!') {
                setError("term", { message: "این واژه یک بار برای این مقاله تعریف شده است." })
            }
            if (error.status === 403) {
                logout();
                return router.replace("/accounts/login/")
            }
        })
    }

    return (
        <div className="bg-gradient-to-b from-blue-100 to-blue-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full px-4">
                <div className="flex flex-col gap-1">
                    <label>واژه</label>
                    <input {...register("term", {
                        required: "لطفا واژه را وارد کنید."
                    })}  type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                </div>
                {errors.term && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.term.message}</span>}
                <div className="flex flex-col gap-1">
                    <label>توضیحات</label>
                    <textarea {...register("definition", {
                        required: "لطفا توضیحات دسته بندی را وارد کنید."
                    })} rows={3} className="text-xs resize-none border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                </div>
                {errors.definition && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.definition.message}</span>}
                <div className="flex items-center gap-2 pt-6 mx-auto">
                    <button type="button" onClick={() => closeModalHandler(false)} className="bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200 transition-colors duration-300">انصراف</button>
                    <button disabled={updateIsPending} className="disabled:pointer-events-none disabled:text-gray-400 bg-yellow-50 text-yellow-600 px-6 py-1 rounded-md hover:bg-yellow-200 active:bg-yellow-200 transition-colors duration-300">{updateIsPending ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "بروزرسانی" }</button>
                </div>
            </form>
        </div>
    )
};

export default UpdateGlossaryModal;