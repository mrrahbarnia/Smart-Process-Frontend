"use client"
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import TicketList from "./TicketList";
import { useState, useEffect } from "react";
import useGetAllTickets from "@/hooks/useQueries/useGetAllTickets";

const TicketsContainer = () => {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const [pageNumber, setPageNumber] = useState<string | null>();
    const searchParams = useSearchParams();
    const {
        ticketsCount,
        ticketsData,
        ticketsIsError,
        ticketsIsPending
    } = useGetAllTickets({page: pageNumber});

    useEffect(() => {
        if (searchParams.get("page")) {
            setPageNumber(searchParams.get("page"));
        }
    }, [searchParams])

    if (ticketsIsError) {
        logout();
        router.replace("/accounts/login/");
    }

    if (ticketsIsPending) {
        return <AiOutlineLoading3Quarters className="text-blue-800 animate-spin w-12 h-12 m-auto" />
    }

    let hasPreviousPage;
    let hasNextPage;

    if (searchParams.get("page")) {
        if (searchParams.get("page") === "1") {
            hasPreviousPage = false;
        } else {
            hasPreviousPage = true;
        }
    } else {
        hasPreviousPage = false;
    }

    if (ticketsCount && (Number(searchParams.get("page")) ? Number(searchParams.get("page")) : 1 ) * 10 <= ticketsCount) {
        hasNextPage = true;
    } else {
        hasNextPage = false;
    }

    const previousHandler = () => {
        const url = `/admin/tickets/?page=${searchParams.get("page") ? Number(searchParams.get("page")) -1  : "1"}`
        return router.replace(url)
    };

    const nextHandler = () => {
        const url = `/admin/tickets/?page=${searchParams.get("page") ? Number(searchParams.get("page")) + 1  : "2"}`
        return router.replace(url);
    };

    return (
        <div className="w-full flex flex-col gap-4 min-h-screen px-2 md:px-6 min-[950px]:px-40 pt-16">
            <h1 className="text-center text-lg">مدیریت نظرات و انتقادات</h1>
            <div className="text-sm bg-blue-300 rounded-md py-1 px-4 flex items-center justify-between">
                {ticketsCount && <span>تعداد صفحات: {Math.ceil(ticketsCount / 10)}</span>}
                <span>تعداد نظرات: {ticketsCount}</span>
            </div>
            {ticketsData && <TicketList tickets={ticketsData}/>}

                {/* Pagination */}
                <div className="flex items-center gap-4 mx-auto pt-8">
                    {
                        hasNextPage && 
                        <button onClick={nextHandler} className="flex items-center bg-blue-50 text-blue-800 transition-colors duration-300 hover:bg-blue-200 rounded-md p-1" type="button">
                            <GrFormNext />
                            <span>صفحه بعد</span>
                        </button>
                    }

                    {
                        hasPreviousPage && 
                        <button onClick={previousHandler} className="flex items-center bg-blue-50 text-blue-800 transition-colors duration-300 hover:bg-blue-200 rounded-md p-1" type="button">
                            <span>صفحه قبل</span>
                            <GrFormPrevious />
                        </button>
                    }
                </div>
        </div>
    )
};

export default TicketsContainer;