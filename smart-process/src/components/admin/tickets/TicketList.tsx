"use client"
import { TicketType } from "@/hooks/useQueries/useGetAllTickets";
import TicketItem from "./TicketItem";

const TicketList = (props: {tickets: TicketType[]}) => {
    return (
        <div className="flex flex-col gap-8 pt-4 w-full min-[500px]:w-[460px] mx-auto">
            {props.tickets.map(ticket => <TicketItem key={ticket.name} ticket={ticket} />)}
        </div>
    )
};

export default TicketList;