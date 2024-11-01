"use client"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateGlossary } from "@/hooks/useMutations/useCreateGlossary";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

type InputTypes = {
    term: string,
    definition: string,
}


const CreateGlossaryModal = ({articleId, closeModalHandler}: {articleId: string, closeModalHandler: Dispatch<SetStateAction<boolean>>}) => {
    const logout = useAuthStore(state => state.logout);
    const router = useRouter();
    const {createIsPending, createMutateAsync} = useCreateGlossary();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<InputTypes>()

    const onSubmit: SubmitHandler<InputTypes> = async(data) => {
        const requestData = {
            term: data.term,
            definition: data.definition,
            articleId: articleId
        }
        
        createMutateAsync({data: requestData})
        .then(() => {
            closeModalHandler(false);
        })
        .catch((error) => {
            if (error.status === 403) {
                logout();
                return router.replace("/accounts/login/")
            }
            if (error.response && error.response.data?.detail === 'Term and article_id are unique together!') {
                setError("term", { message: "این واژه یک بار برای این مقاله تعریف شده است." })
            }
        })
    }

    return (
        <div className="bg-gradient-to-b from-blue-100 to-blue-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full px-4">
                <div className="flex flex-col gap-1">
                    <label>واژه</label>
                    <input {...register("term", {
                        required: "لطفا واژه ی مورد نظر را وارد کنید.",
                        maxLength: {
                            value: 250,
                            message: "طول واژه باید حداکثر ۲۵۰ باشد."
                        }
                    })}  type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                </div>
                {errors.term && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.term.message}</span>}
                <div className="flex flex-col gap-1">
                    <label>توضیحات</label>
                    <textarea {...register("definition", {
                        required: "لطفا توضیحات واژه ی مورد نظر را وارد کنید."
                    })} rows={3} className="text-xs resize-none border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                </div>
                {errors.definition && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.definition.message}</span>}
                <div className="flex items-center gap-2 pt-6 mx-auto">
                    <button type="button" onClick={() => closeModalHandler(false)} className="bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200 transition-colors duration-300">انصراف</button>
                    <button disabled={createIsPending} className="disabled:pointer-events-none disabled:text-gray-400 bg-yellow-50 text-yellow-600 px-6 py-1 rounded-md hover:bg-yellow-200 active:bg-yellow-200 transition-colors duration-300">{createIsPending ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "تأیید" }</button>
                </div>
            </form>
        </div>
    )
};

export default CreateGlossaryModal;
