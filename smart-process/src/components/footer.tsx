import { BsTelegram } from "react-icons/bs"; 
import { AiFillInstagram } from "react-icons/ai"; 
import { AiOutlinePushpin } from "react-icons/ai"; 
import { AiOutlinePhone } from "react-icons/ai"; 
import Image from "next/image";

const Footer = () => {
    return <footer className="mt-24 bg-gradient-to-b from-white via-blue-200 to-blue-300 [clip-path:polygon(0%_100%,100%_100%,100%_0%,0%_20%)]" >
                <div className="p-5 py-20 flex flex-col gap-2 items-center">
                    <Image src="/images/logo.svg" alt="logo" height={500} width={500} className="w-32 md:w-40"/>
                    <div className="flex flex-col gap-1 w-full md:flex-row lg:w-4/6">
                        <div className="bg-blue-300 flex flex-col rounded-md w-full p-5 gap-1">
                            <div className="flex items-center gap-1">
                                <AiOutlinePhone size={20} />
                                <span className="text-sm font-[YekanBakh-Bold]">تلفن های تماس</span>
                            </div>
                            <hr />
                            <div className="flex items-center justify-between text-sm">
                                <span>دفتر مرکزی</span>
                                <span>۰۴۴۴۴۲۳۸۸۷۸</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>دفتر فروش</span>
                                <span>۰۴۴۳۲۲۵۴۱۴۱</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>موبایل</span>
                                <span>۰۹۱۲۰۷۰۸۸۷۸</span>
                            </div>
                        </div>
                        <div className="bg-blue-300 flex flex-col rounded-md w-full p-5 gap-1">
                            <div className="flex items-center gap-1">
                                <AiOutlinePushpin size={20} />
                                <span className="text-sm font-[YekanBakh-Bold]">آدرس</span>
                            </div>
                            <hr />
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-sm">دفتر مرکزی</span>
                                <span className="text-xs">پیرانشهر خیابان ملارضا طبقه ۱ واحد ۴</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">دفتر فروش</span>
                                <span className="text-xs">ارومیه خیابان طرزی پلاک 40 طبقه همکف</span>
                            </div>
                        </div>
                    </div>
                    
                    <hr className="border-blue-800 w-full" />
                    <div className="flex flex-col items-center">
                        <p className="font-[YekanBakh-Bold] text-blue-900">لینک شبکه های اجتماعی</p>
                        <div className="flex items-center gap-1">
                            <a 
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.instagram.com/smartprocess.ir">
                                <AiFillInstagram size={25} />
                            </a>
                            <a 
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://t.me/Sale_SmartProcess ">
                                <BsTelegram size={22} />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
};

export default Footer;