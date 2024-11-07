"use client"
import { BiCheck } from "react-icons/bi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { BiMenu } from "react-icons/bi";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlinePassword } from "react-icons/md";
import { MdLockReset } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

const INTERNAL_LOGOUT_API = "/apis/accounts/logout/"

const Header = () => {
    const role = useAuthStore((state) => state.role);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [showAccountMobileMenu, setShowAccountMobileMenu] = useState<boolean>(false);
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

    const logoutHandler = async() => {
        logout();
        await axios.delete(INTERNAL_LOGOUT_API)
    }

    return (
        <div className="flex justify-between items-center bg-white fixed z-40 left-0 top-0 right-0 h-12 lg:h-14 px-2 sm:px-6 py-3">
            <div className="relative flex items-center gap-2" onClick={() => setShowAccountMobileMenu(!showAccountMobileMenu)} >
                <div className={`relative hover:text-blue-800 transition-colors duration-300 cursor-pointer ${isAuthenticated && "shadow-lg bg-gray-200 rounded-md px-2 py-1"}`}>
                    {isAuthenticated && <BiCheck size={13} className="text-green-600 absolute right-0 top-0" />}
                    <MdOutlineAccountCircle 
                        size={25}
                    />
                </div>
                {showAccountMobileMenu && !showMobileMenu && <div className={`cursor-pointer flex flex-col gap-2 absolute ${isAuthenticated ? "top-10" : "top-7"} bg-blue-100 w-40 p-2 rounded-md shadow-lg`}>
                    {!isAuthenticated && <Link href="/accounts/login/" className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 p-2 py-1">
                        <FiLogIn size={18} />
                        <p className="text-sm" >ورود</p>
                    </Link>}
                    {!isAuthenticated && <Link href="/accounts/reset-password/" className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 p-2 py-1">
                        <MdLockReset size={18} />
                        <p className="text-sm" >بازیابی رمز عبور</p>
                    </Link>}
                    {isAuthenticated && <Link href="/accounts/change-password/" className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 p-2 py-1">
                        <MdOutlinePassword size={18} />
                        <p className="text-sm" >تغییر رمز عبور</p>
                    </Link>}
                    {role === "admin" && isAuthenticated && <Link href="/admin/products/" className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 px-2 py-1">
                        <RiAdminLine size={18} />
                        <p className="text-sm" >پنل ادمین</p>
                    </Link>}
                    {isAuthenticated && <div onClick={logoutHandler} className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 px-2 py-1">
                        <RiLogoutBoxLine size={18} />
                        <a className="text-sm" >خروج</a>
                    </div>}
                </div>}
                <BiMenu size={25} className="hover:text-blue-800 transition-colors duration-300 lg:hidden cursor-pointer" onClick={() => setShowMobileMenu(true)} />

                {/* Mobile header */}
                <div className={`z-50 fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-3/5 transform transition-transform bg-gradient-to-l from-blue-50 to-blue-200 duration-500 ${showMobileMenu ? "translate-x-0" : "translate-x-full"}`}>
                    <button className="absolute right-2 top-2 hover:text-red-600" onClick={() => setShowMobileMenu(false)}>X</button>
                    <div className="pt-12 pr-5 flex flex-col gap-3 font-[YekanBakh-Black]">
                        <Link onClick={() => setShowMobileMenu(false)} href="/articles/" className="text-sm hover:text-gray-600 transition-colors duration-100">مقالات</Link>
                        <hr className="border border-blue-200" />
                        <Link onClick={() => setShowMobileMenu(false)} href="/ticket/" className="text-sm hover:text-gray-600 transition-colors duration-100">فرم نظرسنجی و شکایات</Link>
                        <hr className="border border-blue-200" />
                        <Link onClick={() => setShowMobileMenu(false)} href="/inquiry-guaranty/" className="text-sm hover:text-gray-600 transition-colors duration-100">استعلام گارانتی</Link>
                        <hr className="border border-blue-200" />
                        <Link onClick={() => setShowMobileMenu(false)} href="/products/" className="text-sm hover:text-gray-600 transition-colors duration-100">محصولات</Link>
                        <hr className="border border-blue-200" />
                        <Link onClick={() => setShowMobileMenu(false)} href="/brands/" className="text-sm hover:text-gray-600 transition-colors duration-100">برند ها</Link>
                    </div>
                </div>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:flex items-center w-1/3 justify-between font-[YekanBakh-Bold]">
                <Link href="/ticket/">فرم نظرسنجی و شکایات</Link>
                <Link href="/inquiry-guaranty/">استعلام گارانتی</Link>
                <Link href="/brands/">برند ها</Link>
            </div>

            {/* Logo */}
            <Link href="/" className="text-lg">
                <Image src="/images/logo.svg" alt="logo" height={500} width={500} className="w-32 md:w-40"/>
            </Link>

            {showMobileMenu && <div className="fixed left-0 top-0 z-30 bg-black h-full w-full opacity-65"></div>}
        </div>
    );
};

export default Header;
