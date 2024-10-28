import { GiCctvCamera } from "react-icons/gi"; 
import { CgComment } from "react-icons/cg"; 
import { TbBinaryTree2 } from "react-icons/tb"; 
import { SiBrandfolder } from "react-icons/si";
import { MdOutlineCategory } from "react-icons/md"; 
import { AiOutlineHome } from "react-icons/ai"; 
import { SiMicrosoftexcel } from "react-icons/si"; 
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminHeader = () => {
    const router = useRouter();
    const role = useAuthStore((state) => state.role)

    useEffect(() => {
        if (role !== "admin") {
            router.back()
        }
    }, [role, router])

    return (
        <ul className="w-12 bg-white h-auto p-3 pt-5 space-y-3">

            {/* Home Page */}
            <Link href="/" className="relative group flex items-center z-10">
                <AiOutlineHome className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20} />
                <li className="absolute w-20 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm shadow-lg border-blue-600 border-2">صفحه اصلی</li>
            </Link>

            {/* Products */}
            <Link href="/admin/products/" className="relative group flex items-center z-10">
                <GiCctvCamera className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20}/>
                <li className="absolute w-18 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm shadow-lg border-blue-600 border-2">محصولات</li>
            </Link>

            {/* Categories */}
            <Link href="/admin/categories/" className="relative group flex items-center z-10">
                <MdOutlineCategory className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20}/>
                <li className="absolute w-24 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm shadow-lg border-blue-600 border-2">دسته بندی ها</li>
            </Link>

            {/* Brands */}
            <Link href="/admin/brands/" className="relative group flex items-center z-10">
                <SiBrandfolder className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20} />
                <li className="absolute w-14 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm shadow-lg border-blue-600 border-2">برند ها</li>
            </Link>

            {/* Attributes */}
            <Link href="/admin/attributes/" className="relative group flex items-center z-10">
                <TbBinaryTree2 className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20} />
                <li className="absolute w-16 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm shadow-lg border-blue-600 border-2">ویژگی ها</li>
            </Link>

            {/* Tickets */}
            <Link href="/admin/tickets/" className="relative group flex items-center z-10">
                <CgComment className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20}/>
                <li className="absolute w-12 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm shadow-lg border-blue-600 border-2">نظرات</li>
            </Link>

            {/* Guaranty file */}
            <Link href="/admin/add-guaranties/" className="relative group flex items-center z-10">
                <SiMicrosoftexcel className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20}/>
                <li className="absolute w-32 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm shadow-lg border-blue-600 border-2">بارگذاری فایل گارانتی</li>
            </Link>

        </ul>
    )
};

export default AdminHeader;
