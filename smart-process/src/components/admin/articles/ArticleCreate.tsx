"use client"
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, ChangeEvent } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useCreateArticle } from "@/hooks/useMutations/useCreateArticle";

type InputTypes = {
    title: string,
    description: string,
    images: File[]
}


const ArticleCreate = () => {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const {createIsPending, createMutateAsync} = useCreateArticle();
    const [selectedImageName, setSelectedImageName] = useState<string[]>([]);
    const {
        register,
        setError,
        handleSubmit,
        formState: {errors}
    } = useForm<InputTypes>();

    const onSubmit: SubmitHandler<InputTypes> = async(data) => {
        if (data.images.length > 3) {
            setError("images", { message: "حداکثر مجاز به بارگذاری سه عکس میباشید." });
            return;
        }
        const formData = new FormData();
        formData.append("title", data.title)
        formData.append("description", data.description)
        for (let i = 0; i < data.images.length; i++) {
            formData.append("images", data.images[i]);
        }
        createMutateAsync(formData)
        .then(() => {
            return router.replace("/admin/articles/")
        })
        .catch((error) => {
            console.log(error.response.data?.detail);
            if (error.status === 403) {
                logout();
                router.replace("/accounts/login/")
            }
            if (error.response && error.response.data?.detail === 'Unique title for articles!') {
                setError("title", { message: "عنوان مقاله تکراریست." })
                return;
            }
        })
        
    }

    const imageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const fileNames = files.map((file) => file.name);
        setSelectedImageName(fileNames)
    }

    return (
        <div className="border-2 rounded-md border-blue-300 bg-blue-50 w-3/4 min-[650px]:w-2/3 min-[750px]:w-7/12 min-[850px]:w-6/12 min-[950px]:w-5/12 min-[1050px]:w-4/12 mx-auto mt-16 py-10 h-auto">
            <h1 className="text-center text-lg text-blue-900">فرم ثبت مقاله</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-8 px-2">
                <div className="flex flex-col w-full gap-1">
                    <label>عنوان مقاله</label>
                    <input {...register("title", {
                        required: "لطفا عنوان مقاله را وارد کنید.",
                        maxLength: {
                            value: 200,
                            message: "طول عنوان مقاله باید حداکثر دویست باشد."
                        }
                    })} className="h-10 rounded-md border-blue-100 px-2" type="text" />
                    {errors.title && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.title.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="bg-blue-200 hover:bg-blue-300 text-blue-950 p-1 rounded-md cursor-pointer w-fit transition-colors duration-300" htmlFor="imageInput">عکس های مقاله</label>
                    <input multiple id="imageInput" hidden className="h-10 rounded-md border-blue-100 px-2" type="file" dir="ltr" {...register("images", {
                        required: "لطفا حداقل یک عکس را بارگذاری کنید.",
                        onChange: imageChangeHandler
                    })} />
                    <div className="text-xs flex items-center gap-1 bg-yellow-400 rounded-md p-1">
                        <AiOutlineWarning size={20} />
                        <p>حداکثر مجاز به بارگذاری سه عکس میباشید.</p>
                    </div>
                    <div className="flex flex-col justify-start gap-1">
                        {selectedImageName.map((imageName) => <span className="bg-green-700 text-white px-2 py-1 text-sm rounded-md w-fit mx-auto" key={imageName}>{imageName}</span>)}
                    </div>
                    {errors.images && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.images.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>توضیحات</label>
                    <textarea rows={6} className="rounded-md border-blue-100 px-2 resize-none p-1" {...register("description", {
                        required: "لطفا توضیحات مقاله را وارد کنید."
                    })}  />
                    {errors.description && <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-md">{errors.description.message}</span>}
                </div>
                <button disabled={createIsPending} className="w-2/3 mx-auto bg-blue-200 hover:bg-blue-300 text-blue-950 p-1 rounded-md transition-colors duration-300">{createIsPending ? <AiOutlineLoading3Quarters className="mx-auto animate-spin"/> : "تأیید"}</button>
            </form>
        </div>
    )
};

export default ArticleCreate;
