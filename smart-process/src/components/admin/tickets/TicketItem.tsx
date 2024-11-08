"use client"
import { BsTelephoneFill } from "react-icons/bs";
import { BsFillTelephoneXFill } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { useState, Fragment } from "react";
import { TicketType } from "@/hooks/useQueries/useGetAllTickets";
import DeleteModal from "./DeleteModal";


const TicketItem = (props: {ticket: TicketType}) => {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    
    const guarantyRating = props.ticket.guarantyRating;
    const repairsRating = props.ticket.repairsRating;
    const notificationRating = props.ticket.notificationRating;
    const personalBehaviorRating = props.ticket.personalBehaviorRating;
    const servicesRating = props.ticket.servicesRating;
    const smartProcessRating = props.ticket.smartProcessRating;
    const criticism = props.ticket.criticism;
    const callRequest = props.ticket.callRequest;

    return (
        <Fragment>

            {/* Delete Modal */}
            {showDeleteModal && <DeleteModal ticketId={props.ticket.id} closeModalHandler={setShowDeleteModal} />}

            <div className="relative border-2 rounded-md border-blue-300 bg-blue-50 flex flex-col gap-2 w-full items-center ">
                <p className="text-base " dir="rtl">نام ثبت کننده:{props.ticket.name}</p>
                <button onClick={() => setShowDeleteModal(true)} className="absolute right-1 top-1 bg-red-100 p-1 rounded-md text-red-800 hover:bg-red-200 transition-colors duration-300">
                        <AiOutlineDelete size={20}/>
                </button>
                <div className="absolute left-1 top-1 p-1 rounded-md text-blue-800 bg-blue-200">
                    <div className="relative group">
                        {callRequest ? <BsTelephoneFill /> : <BsFillTelephoneXFill/> }
                        <span className="absolute hidden bg-blue-100 text-blue-800 p-1 top-6 left-1 w-[117px] rounded-md text-xs  group-hover:block">{callRequest ? "درخواست تماس دارد" : "درخواست تماس ندارد" }</span>
                    </div>
                </div>
                <hr className="border-1 border-gray-300 w-2/3"/>
                <div className="flex items-center text-xs justify-between w-full px-2">
                    <p className={`rounded-md p-1 ${props.ticket.phoneNumber ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>شماره موبایل:{props.ticket.phoneNumber ? props.ticket.phoneNumber : "ثبت نشده است"}</p>
                    <p className={`rounded-md p-1 ${props.ticket.productSerial ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>شماره سریال کالا:{props.ticket.productSerial ? props.ticket.productSerial : "ثبت نشده است"}</p>
                </div>
                <div className="space-y-2 text-xs bg-gray-200 rounded-md py-1 px-4 w-11/12">
                    <div className={`flex items-center justify-between px-2 py-1 rounded-md ${guarantyRating === 5 ? "text-green-800 bg-green-100" : guarantyRating === 4 ? "text-green-800 bg-green-100" : guarantyRating === 3 ? "text-yellow-800 bg-yellow-100" : guarantyRating === 2 ? "text-red-800 bg-red-100" : "text-red-800 bg-red-100" }`}>
                        <span>ارتباط با بخش های پشتیبانی و گارانتی</span>
                        <span>{guarantyRating}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className={`flex items-center justify-between px-2 py-1 rounded-md ${repairsRating === 5 ? "text-green-800 bg-green-100" : repairsRating === 4 ? "text-green-800 bg-green-100" : repairsRating === 3 ? "text-yellow-800 bg-yellow-100" : repairsRating === 2 ? "text-red-800 bg-red-100" : "text-red-800 bg-red-100" }`}>
                        <span>زمان سپری شده جهت تعمیرات و تحویل مجدد کالا</span>
                        <span>{repairsRating}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className={`flex items-center justify-between px-2 py-1 rounded-md ${notificationRating === 5 ? "text-green-800 bg-green-100" : notificationRating === 4 ? "text-green-800 bg-green-100" : notificationRating === 3 ? "text-yellow-800 bg-yellow-100" : notificationRating === 2 ? "text-red-800 bg-red-100" : "text-red-800 bg-red-100" }`}>
                        <span>اطلاع رسانی یا سهولت پیگیری برای تعمیر دستگاه</span>
                        <span>{notificationRating}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className={`flex items-center justify-between px-2 py-1 rounded-md ${personalBehaviorRating === 5 ? "text-green-800 bg-green-100" : personalBehaviorRating === 4 ? "text-green-800 bg-green-100" : personalBehaviorRating === 3 ? "text-yellow-800 bg-yellow-100" : personalBehaviorRating === 2 ? "text-red-800 bg-red-100" : "text-red-800 bg-red-100" }`}>
                        <span>رفتار و برخورد پرسنل</span>
                        <span>{personalBehaviorRating}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className={`flex items-center justify-between px-2 py-1 rounded-md ${servicesRating === 5 ? "text-green-800 bg-green-100" : servicesRating === 4 ? "text-green-800 bg-green-100" : servicesRating === 3 ? "text-yellow-800 bg-yellow-100" : servicesRating === 2 ? "text-red-800 bg-red-100" : "text-red-800 bg-red-100" }`}>
                        <span>کیفیت خدمات دریافتی</span>
                        <span>{servicesRating}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className={`flex items-center justify-between px-2 py-1 rounded-md ${smartProcessRating === 5 ? "text-green-800 bg-green-100" : smartProcessRating === 4 ? "text-green-800 bg-green-100" : smartProcessRating === 3 ? "text-yellow-800 bg-yellow-100" : smartProcessRating === 2 ? "text-red-800 bg-red-100" : "text-red-800 bg-red-100" }`}>
                        <span>گارانتی و خدمات پشتیبانی پردازش هوشمند</span>
                        <span>{smartProcessRating}</span>
                    </div>
                </div>
                <div className="flex flex-col w-full px-4 py-2 gap-1">
                    <h2 className="">متن نظر/انتقاد</h2>
                    <p className="bg-gray-200 rounded-md p-1 text-xs text-blue-800">{criticism}</p>

                </div>
            </div>
            {showDeleteModal && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
        </Fragment>
    )
};

export default TicketItem;