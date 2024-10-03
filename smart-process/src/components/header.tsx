"use client"
import { RiLogoutBoxLine } from "react-icons/ri";
import { SiMicrosoftexcel } from "react-icons/si"; 
import { TbBrandGoogleBigQuery } from "react-icons/tb";
import { FiLogIn } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

const INTERNAL_LOGOUT_API = "/apis/accounts/logout/"

const Header = () => {
    const rule = useAuthStore((state) => state.rule);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [showAccountMobileMenu, setShowAccountMobileMenu] = useState<boolean>(false);

    const logoutHandler = async() => {
        logout();
        await axios.delete(INTERNAL_LOGOUT_API)
    }

    return (
        <div className="flex justify-between bg-white fixed left-0 right-0 h-12 px-2 py-3">
            <div className="relative">
                <MdManageAccounts 
                    className="cursor-pointer"
                    size={25}
                    onClick={() => setShowAccountMobileMenu(!showAccountMobileMenu)} 
                />
                {showAccountMobileMenu && <div className="cursor-pointer flex flex-col gap-2 absolute bg-blue-100 w-40 p-2 rounded-md shadow-lg">
                    <div className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 p-2 py-1">
                        <FiLogIn size={18} />
                        <Link href="/accounts/login/" className="text-sm" >ورود</Link>
                    </div>
                    <div className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 px-2 py-1">
                        <TbBrandGoogleBigQuery size={18} />
                        <Link href="/accounts/login/" className="text-sm" >استعلام گارانتی</Link>
                    </div>
                    {rule === "admin" && isAuthenticated && <div className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 px-2 py-1">
                        <SiMicrosoftexcel size={18} />
                        <Link href="/admin/add-guaranties/" className="text-sm" >ثبت فایل گارانتی</Link>
                    </div>}
                    {isAuthenticated && <div onClick={logoutHandler} className="flex items-center cursor-pointer gap-1 rounded-md hover:bg-blue-200 hover:text-blue-800 px-2 py-1">
                        <RiLogoutBoxLine size={18} />
                        <a className="text-sm" >خروج</a>
                    </div>}
                </div>}
            </div>
            <div>
                <span className="text-lg">SmartProcess</span>
            </div>
            
        </div>
    );
};

export default Header;