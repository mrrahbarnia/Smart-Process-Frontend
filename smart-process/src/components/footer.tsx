import { SiWhatsapp } from "react-icons/si"; 
import { ImLinkedin2 } from "react-icons/im"; 
import { ImFacebook2 } from "react-icons/im"; 
import { BsInstagram } from "react-icons/bs"; 
import { FaTelegramPlane } from "react-icons/fa"; 
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return <footer className="mt-24 bg-[#1f5da6] flex flex-col">
                <div className="p-5 md:p-10 w-full">
                    <div className="flex items-center gap-3 md:gap-14 text-white text-xs md:text-lg">
                        <Link className="hover:text-blue-100 transition-colors duration-200" href="/products/">محصولات</Link>
                        <Link className="hover:text-blue-100 transition-colors duration-200" href="/articles/">مقالات</Link>
                        <Link className="hover:text-blue-100 transition-colors duration-200" href="#">درباره ما</Link>
                        <Link className="hover:text-blue-100 transition-colors duration-200" href="/service/inquiry-guaranty/">استعلام گارانتی</Link>
                        <Link className="hover:text-blue-100 transition-colors duration-200" href="/service/ticket/">رضایت سنجی</Link>
                    </div>
                    <div className="flex flex-col md:flex-row w-full items-center justify-between text-white mt-12 md:mr-7">
                        <div className="flex flex-col gap-4">
                            <p>دفتر مرکزی:۰۴۴-۴۴۲۳۸۸۷۸</p>
                            <p>دفتر فروش:۰۴۴-۳۲۲۵۴۱۴۱</p>
                            <p>پشتیبانی فنی:۰۲۱-۸۲۸۰۸۸۷۸</p>
                            <p className="mt-5">
                                آدرس:پیرانشهر خیابان ملارضا,مجتمع بوداقی,طبقه ۱ واحد ۴
                            </p>
                            <p>کد پستی:۵۷۸۱۹۵۴۵۸۸</p>
                        </div>
                        <div className="flex gap-1 bg-white rounded-md ">
                            <a className="hover:bg-blue-100 transition-colors duration-200" referrerPolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=547775&Code=yW4KesUyclZeKva9ToLDEAJEw73hQxNe'><Image referrerPolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=547775&Code=yW4KesUyclZeKva9ToLDEAJEw73hQxNe' className="w-40 h-40" width={40} height={40} alt='enamad' style={{ cursor: 'pointer' }} /></a>
                            <Image width={40} height={40} referrerPolicy='origin' id = 'rgvjjzpewlaowlaojxlzsizp' style={{ cursor: 'pointer' }} onClick={() => window.open("https://logo.samandehi.ir/Verify.aspx?id=374419&p=xlaojyoeaodsaodsrfthpfvl", "Popup","toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30")} alt = 'logo-samandehi' src = 'https://logo.samandehi.ir/logo.aspx?id=374419&p=qftiyndtshwlshwlnbpdbsiy' />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-0 w-full items-center justify-between text-white px-10">
                    {/* Social Network Links */}
                    <div className="flex items-center gap-6">
                        <a 
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://t.me/Sale_SmartProcess">
                            <FaTelegramPlane size={30} />
                        </a>
                        <a 
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://wa.me/989120708878">
                            <SiWhatsapp size={30} />
                        </a>
                        <a 
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.instagram.com/smartprocess.ir">
                            <BsInstagram size={30} />
                        </a>
                        <a 
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.facebook.com/smartproces">
                            <ImFacebook2 size={30} />
                        </a>
                        <a 
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.linkedin.com/company/smartprocess-ir/">
                            <ImLinkedin2 size={30} />
                        </a>
                    </div>
                    <span className="text-5xl -skew-x-12 font-sans font-bold">HIKVISION</span>
                </div>
                <div className="bg-white flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 px-10 mt-3">
                    <Image src="/images/persian-logo.jpeg" width={300} height={1200} alt="Logo" />
                    <p className="text-black font-[YekanBakh-Bold] text-xs md:text-lg mb-3 md:mb-0">کلیه حقوق مالکیت این وبسایت متعلق به شرکت پردازش هوشمند میباشد.</p>
                </div>
                <p className="text-center my-4 text-white">Be Professional</p>
            </footer>
};

export default Footer;