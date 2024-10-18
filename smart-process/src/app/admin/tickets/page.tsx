"use client"
import { Suspense } from "react";
import TicketsContainer from "@/components/admin/tickets/TicketContainer";

const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <TicketsContainer />
        </Suspense>
    )
};

export default Page;