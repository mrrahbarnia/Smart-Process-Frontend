"use client"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUpdateTag } from "@/hooks/useMutations/useUpdateTag";
import { TagType } from "@/hooks/useQueries/useGetAllTags";

type InputTypes = {
    name: string
}


const UpdateModal = ({tag, closeModalHandler}: {tag: TagType, closeModalHandler: Dispatch<SetStateAction<boolean>>}) => {
    const {updateIsPending, updateMutateAsync} = useUpdateTag();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<InputTypes>({
        defaultValues: {
            name: tag.name
        }
    })

    const onSubmit: SubmitHandler<InputTypes> = (data) => {
        updateMutateAsync({name: tag.name, data: data})
        .then(() => {
            closeModalHandler(false);
        })
        .catch(error => {
            if (error.response && error.response.data?.detail === "Unique name for tags!") {
                setError("name", { message: "تگ تکراریست." })
            }
        })
    }

    return (
        <div className="bg-gradient-to-b from-blue-100 to-blue-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 rounded-lg py-10 items-center justify-center gap-7 w-80">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full px-4">
                <div className="flex flex-col gap-1">
                    <label>ویژگی</label>
                    <input {...register("name", {
                        required: "لطفا تگ را وارد کنید."
                    })}  type="text" className="border-2 outline-1 py-2 px-3 w-full rounded-md"/>
                </div>
                {errors.name && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.name.message}</span>}
                <div className="flex items-center gap-2 pt-6 mx-auto">
                    <button type="button" onClick={() => closeModalHandler(false)} className="bg-red-50 text-red-600 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200 transition-colors duration-300">انصراف</button>
                    <button disabled={updateIsPending} className="disabled:pointer-events-none disabled:text-gray-400 bg-yellow-50 text-yellow-600 px-6 py-1 rounded-md hover:bg-yellow-200 active:bg-yellow-200 transition-colors duration-300">{updateIsPending ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : "بروزرسانی" }</button>
                </div>
            </form>
        </div>
    )
};

export default UpdateModal;