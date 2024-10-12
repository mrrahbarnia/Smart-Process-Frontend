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
    const rule = useAuthStore((state) => state.rule)

    useEffect(() => {
        if (rule !== "admin") {
            router.back()
        }
    }, [rule, router])

    return (
        <ul className="w-12 bg-white h-auto p-3 pt-5 space-y-3">

            {/* Home Page */}
            <Link href="/" className="relative group flex items-center">
                <AiOutlineHome className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20} />
                <li className="absolute w-20 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm">صفحه اصلی</li>
            </Link>

            {/* Categories */}
            <Link href="/admin/categories/" className="relative group flex items-center">
                <MdOutlineCategory className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20}/>
                <li className="absolute w-24 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm">دسته بندی ها</li>
            </Link>

            {/* Brands */}
            <Link href="/admin/brands/" className="relative group flex items-center">
                <SiBrandfolder className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20} />
                <li className="absolute w-14 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm">برند ها</li>
            </Link>

            {/* Guaranty file */}
            <Link href="/admin/add-guaranties/" className="relative group flex items-center">
                <SiMicrosoftexcel className="cursor-pointer hover:text-blue-800 transition-colors duration-300" size={20}/>
                <li className="absolute w-36 bg-blue-100 rounded-md p-1 right-7 hidden group-hover:block text-sm">بارگذاری فایل گارانتی</li>
            </Link>

        </ul>
    )
};

export default AdminHeader;
