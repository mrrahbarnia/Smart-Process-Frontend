"use client"
import { TbSquareRoundedArrowLeftFilled } from "react-icons/tb";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { BiMenu } from "react-icons/bi";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlinePassword } from "react-icons/md";
import { MdLockReset } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";
import { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import useGetRootCategories from "@/hooks/useQueries/useGetRootCategories";
import useGetSubCategories from "@/hooks/useQueries/useGetSubCategories";

const INTERNAL_LOGOUT_API = "/apis/accounts/logout/"

type RootCategoriesStateType = {
    visible: boolean,
    fetching: boolean
}

type SubCategoriesStateType = {
    categoryId: number,
    enabled: boolean,
    layer: "Second" | "Third"
}

type categoriesType = {
    id: number,
    name: string
}

const Header = () => {
    const role = useAuthStore((state) => state.role);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [showAccountMobileMenu, setShowAccountMobileMenu] = useState<boolean>(false);
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const [serviceMenuStatus, setServiceMenuStatus] = useState<"open" | "close">("close");
    const [showServices, setShowServices] = useState<boolean>(false);
    const hideService = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideRootCategories = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [rootCategoriesState, setRootCategoriesState] = useState<RootCategoriesStateType>(
        {visible: false, fetching: false}
    )
    const [subCategoriesState, setSubCategoriesState] = useState<SubCategoriesStateType>(
        {categoryId: 0, enabled: false, layer: "Second"}
    )
    const [subCategories, setSubCategories] = useState<categoriesType[]>();
    const [thirdLayerCategories, setThirdLayerCategories] = useState<categoriesType[]>();
    const {
        subCategoriesData,
    } = useGetSubCategories(subCategoriesState)
    const {
        rootCategoriesData,
        rootCategoriesIsPending
    } = useGetRootCategories(rootCategoriesState.fetching);

    const logoutHandler = async() => {
        logout();
        await axios.delete(INTERNAL_LOGOUT_API)
    }

    const changeServiceIconHandler = () => {
        if (serviceMenuStatus === "close") {
            setServiceMenuStatus("open")
            setRootCategoriesState({visible: false, fetching: false});
        }
        if (serviceMenuStatus === "open") {
            setServiceMenuStatus("close")
        }
    }

    useEffect(() => {
        if (subCategoriesData) {
            if (subCategoriesState.layer === "Second") {
                setSubCategories(subCategoriesData);
                setThirdLayerCategories([]);
            } else if (subCategoriesState.layer === "Third") {
                setThirdLayerCategories(subCategoriesData);
            }
        }
    }, [subCategoriesData, subCategoriesState.layer])

    const rootCategoriesHandleMouseEnter = () => {
        if (hideRootCategories.current) {
            clearTimeout(hideRootCategories.current)
        }
        setRootCategoriesState({visible: true, fetching: true});
    }

    const rootCategoriesHandleMouseLeave = () => {
        hideRootCategories.current = setTimeout(() => {
            setRootCategoriesState({visible: false, fetching: false})
            setSubCategoriesState({categoryId: 0, enabled: false, layer: "Second"})
        }, 100)
    }

    const serviceHandleMouseEnter = () => {
        if (hideService.current) {
            clearTimeout(hideService.current)
        }
        setShowServices(true);
    }

    const serviceHandleMouseLeave = () => {
        hideService.current = setTimeout(() => setShowServices(false), 100)
    }

    const getSubCategory = ({categoryId, layer}: {categoryId: number, layer: "Second" | "Third"}) => {
        if (layer === "Second") {
            setSubCategoriesState({categoryId: categoryId, enabled: true, layer: "Second"})
        } else if (layer === "Third") {
            setSubCategoriesState({categoryId: categoryId, enabled: true, layer: "Third"})
        }
    }

    console.log(rootCategoriesState.visible)
    if (rootCategoriesData) {
        console.log(rootCategoriesData);   
    }

    return (
        <Fragment>
            <div className="flex justify-between items-center bg-white fixed z-40 left-0 top-0 right-0 h-12 lg:h-14 px-2 sm:px-6 py-3">
                <div className="relative flex items-center gap-2" >
                    <div onClick={() => setShowAccountMobileMenu(!showAccountMobileMenu)} className={`relative hover:text-blue-800 transition-colors duration-300 cursor-pointer ${isAuthenticated && "shadow-lg bg-gray-200 rounded-md px-2 py-1"}`}>
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
                        <button className="absolute right-2 top-2 hover:text-red-600" onClick={() => {
                            setShowMobileMenu(false)
                            setServiceMenuStatus("close")
                            setRootCategoriesState({visible: false, fetching: false})
                        }}>X</button>
                        <div className="pt-12 pr-5 flex flex-col gap-3 font-[YekanBakh-Black]">
                            <Link onClick={() => setShowMobileMenu(false)} href="/products/" className="text-sm hover:text-gray-600 transition-colors duration-100">محصولات</Link>
                            <hr className="border border-blue-200" />
                            <Link onClick={() => setShowMobileMenu(false)} href="/brands/" className="text-sm hover:text-gray-600 transition-colors duration-100">برند ها</Link>
                            <hr className="border border-blue-200" />
                            <Link onClick={() => setShowMobileMenu(false)} href="/articles/" className="text-sm hover:text-gray-600 transition-colors duration-100">مقالات</Link>
                            <hr className="border border-blue-200" />
                            <div className="relative flex flex-col gap-2">
                                <button onClick={() => {
                                        setRootCategoriesState((prev) => ({visible: !prev.visible, fetching: !prev.fetching}))
                                        setServiceMenuStatus("close")
                                }} className="flex items-center hover:text-gray-600 transition-colors duration-100">
                                    <span className="text-sm">دسته بندی ها</span>
                                    {!rootCategoriesState.visible && <IoMdArrowDropdown size={18} />}
                                    {rootCategoriesState.visible && <IoMdArrowDropup size={18} />}
                                </button>
                                {rootCategoriesState.visible && rootCategoriesData && <div className="absolute top-8 flex flex-col z-50 gap-2 p-3 rounded-md w-2/3 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-black transform transition-transform duration-500">
                                    {
                                        rootCategoriesData.map(category => {
                                            return <Link
                                                        onClick={() => {
                                                            setRootCategoriesState({visible: false, fetching: false})
                                                            setShowMobileMenu(false)
                                                        }}
                                                        href={`http://127.0.0.1:3000/products?categoryExact=${category.name}`}
                                                        key={category.id}
                                                        className="flex items-center w-full justify-between hover:bg-blue-100 rounded-md px-1 transition-colors duration-200"
                                                    >
                                                <span className="text-sm">{category.name}</span>
                                                <div className="hover:bg-gray-300 p-1 rounded-full transition-colors duration-200">
                                                    <IoMdArrowDropdown 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            e.preventDefault()
                                                            getSubCategory({categoryId: category.id, layer: "Second"})
                                                        }}
                                                        size={18} 
                                                    />
                                                </div>
                                            </Link>
                                        })
                                    }
                                </div>}
                                {subCategories && <div className="absolute bg-red-100 w-full flex flex-col">
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                </div>}
                            </div>
                            <hr className="border border-blue-200" />
                            <div className="relative flex flex-col gap-2">
                                <button onClick={changeServiceIconHandler} className="flex items-center hover:text-gray-600 transition-colors duration-100">
                                    <span className="text-sm">خدمات پس از فروش</span>
                                    {serviceMenuStatus === "close" && <IoMdArrowDropdown size={18} />}
                                    {serviceMenuStatus === "open" && <IoMdArrowDropup size={18} />}
                                </button>
                                <div className={`z-40 absolute top-8 flex flex-col gap-2 p-3 rounded-md w-fit bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-black transform transition-transform duration-500 ${serviceMenuStatus === "close" && "translate-y-10 opacity-0"}`}>
                                    <Link onClick={() => {
                                        setShowMobileMenu(false)
                                        setServiceMenuStatus("close")
                                    }} href="/service/ticket/" className="hover:text-blue-900 transition-colors duration-200 text-sm">فرم نظرسنجی و شکایات</Link>
                                    <Link onClick={() => {
                                        setShowMobileMenu(false)
                                        setServiceMenuStatus("close")
                                    }} href="/service/inquiry-guaranty/" className="hover:text-blue-900 transition-colors duration-200 text-sm">استعلام گارانتی</Link>
                                    <Link onClick={() => {
                                        setShowMobileMenu(false)
                                        setServiceMenuStatus("close")
                                    }} href="/service/guaranty-page/" className="hover:text-blue-900 transition-colors duration-200 text-sm">برگه شرایط گارانتی</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop header */}
                <div className="hidden lg:flex items-center gap-4 w-3/6 justify-between font-[YekanBakh-Bold] text-sm">
                    <Link className="hover:text-blue-900 transition-colors duration-100" href="/products/">محصولات</Link>
                    <div>
                        <button 
                            className="flex items-center hover:text-blue-900 transition-colors duration-100"
                            onMouseEnter={rootCategoriesHandleMouseEnter}
                            onMouseLeave={rootCategoriesHandleMouseLeave}
                        >
                            <span>دسته بندی ها</span>
                            {!rootCategoriesState.visible && <IoMdArrowDropdown size={18} />}
                            {rootCategoriesState.visible && <IoMdArrowDropup size={18} />}
                        </button>
                        {rootCategoriesState.visible && <div 
                            className="flex gap-4 fixed w-screen top-14 right-0 rounded-b-lg p-3 bg-gradient-to-r left-0 bg-blue-300 text-black" 
                            onMouseEnter={rootCategoriesHandleMouseEnter}
                            onMouseLeave={rootCategoriesHandleMouseLeave}
                        >

                            {/* Root Categories */}
                            <div 
                                className="flex flex-col gap-2 w-1/3">
                                {rootCategoriesIsPending && <AiOutlineLoading3Quarters className="animate-spin mx-auto" />}
                                {rootCategoriesData && rootCategoriesData.map((category, index) => {
                                    return <div key={category.id}>
                                                <Link 
                                                    onClick={() => {
                                                        setRootCategoriesState({visible: false, fetching: false})
                                                        setSubCategoriesState({categoryId: 0, enabled: false, layer: "Second"})
                                                    }}
                                                    href={`http://127.0.0.1:3000/products?categoryExact=${category.name}`}
                                                    className="flex w-full justify-between cursor-pointer hover:bg-blue-100 p-1 rounded-md transition-colors duration-200 text-sm text-blue-900"
                                                >
                                                    <p>{category.name}</p>
                                                    <TbSquareRoundedArrowLeftFilled onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        getSubCategory({categoryId: category.id, layer: "Second"})
                                                    }} size={15} className="hover:text-blue-400 transition-colors duration-200" />
                                                </Link>
                                                {index < rootCategoriesData.length - 1 && <hr className="mt-1"/>}
                                            </div>
                                })}
                            </div>

                            {/* Sub Categories */}
                            <div className="flex flex-col gap-2 w-1/3">
                                {
                                    subCategoriesState.enabled && subCategories &&
                                        <div className="flex flex-col">
                                        {subCategories && subCategories.map((subCategory, index) => {
                                            return <div key={subCategory.id}>
                                                        <Link
                                                            onClick={() => {
                                                                setRootCategoriesState({visible: false, fetching: false})
                                                                setSubCategoriesState({categoryId: 0, enabled: false, layer: "Second"})
                                                            }}
                                                            href={`http://127.0.0.1:3000/products?categoryExact=${subCategory.name}`}
                                                            className="flex w-full justify-between cursor-pointer hover:bg-blue-100 p-1 rounded-md transition-colors duration-200 text-sm text-blue-900"
                                                        >
                                                            <p>{subCategory.name}</p>
                                                            <TbSquareRoundedArrowLeftFilled onClick={(e) => {
                                                                e.stopPropagation()
                                                                e.preventDefault()
                                                                getSubCategory({categoryId: subCategory.id, layer: "Third"})
                                                            }}
                                                            size={15} className="hover:text-blue-400 transition-colors duration-200" />
                                                        </Link>
                                                        {index < subCategories.length - 1 && <hr className="my-1"/>}
                                                    </div>
                                        })}
                                    </div>
                                }
                            </div>

                            {/* Third Layer Categories */}
                            <div className="flex flex-col gap-2 w-1/3">
                                {
                                    subCategoriesState.enabled && thirdLayerCategories &&
                                        <div className="flex flex-col">
                                        {thirdLayerCategories && thirdLayerCategories.map((subCategory, index) => {
                                            return <Link 
                                                        onClick={() => {
                                                            setRootCategoriesState({visible: false, fetching: false})
                                                            setSubCategoriesState({categoryId: 0, enabled: false, layer: "Third"})
                                                        }}
                                                        href={`http://127.0.0.1:3000/products?categoryExact=${subCategory.name}`} key={subCategory.id}>
                                                        <p className="flex w-full justify-between cursor-pointer hover:bg-blue-100 p-1 rounded-md transition-colors duration-200 text-sm text-blue-900">{subCategory.name}</p>
                                                        {index < thirdLayerCategories.length - 1 && <hr className="my-1"/>}
                                                    </Link>
                                        })}
                                    </div>
                                }
                            </div>
                        </div>}
                        
                    </div>                
                    <Link className="hover:text-blue-900 transition-colors duration-100" href="/brands/">برند ها</Link>
                    <Link className="hover:text-blue-900 transition-colors duration-100" href="/articles/">مقالات</Link>
                    <div className="relative flex flex-col gap-2">
                        <button
                            onMouseEnter={serviceHandleMouseEnter}
                            onMouseLeave={serviceHandleMouseLeave}
                            className="flex items-center hover:text-blue-900 transition-colors duration-100">
                            <span>خدمات پس از فروش</span>
                            {!showServices && <IoMdArrowDropdown size={18} />}
                            {showServices && <IoMdArrowDropup size={18} />}
                        </button>
                        {showServices && <div
                            onMouseEnter={serviceHandleMouseEnter} 
                            onMouseLeave={serviceHandleMouseLeave} 
                            className="absolute top-8 flex flex-col gap-1 p-3 rounded-md w-fit md:w-44 bg-gradient-to-r bg-blue-300 text-black transform transition-transform duration-500"
                        >
                            <Link onClick={() => {
                                setShowMobileMenu(false)
                                setServiceMenuStatus("close")
                            }} href="/service/ticket/" className="hover:bg-blue-100 p-1 rounded-md transition-colors duration-200 text-sm text-blue-900">فرم نظرسنجی و شکایات</Link>
                            <Link onClick={() => {
                                setShowMobileMenu(false)
                                setServiceMenuStatus("close")
                            }} href="/service/inquiry-guaranty/" className="hover:bg-blue-100 p-1 rounded-md transition-colors duration-200 text-sm text-blue-900">استعلام گارانتی</Link>
                            <Link onClick={() => {
                                setShowMobileMenu(false)
                                setServiceMenuStatus("close")
                            }} href="/service/guaranty-page/" className="hover:bg-blue-100 p-1 rounded-md transition-colors duration-200 text-sm text-blue-900">برگه شرایط گارانتی</Link>
                        </div>}
                    </div>
                </div>

                {/* Logo */}
                <Link href="/" className="text-lg">
                    <Image src="/images/logo.svg" alt="logo" height={500} width={500} className="w-32 md:w-40"/>
                </Link>

                {showMobileMenu && <div className="fixed left-0 top-0 z-30 bg-black h-full w-full opacity-65"></div>}
            </div>
            {rootCategoriesState.visible && <div className="fixed left-0 top-0 z-30 bg-black h-full w-full opacity-65"></div>}
        </Fragment>
    );
};

export default Header;
