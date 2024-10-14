"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_API = "/apis/admin/get-all-tickets/";

export type TicketType = {
    id: number,
    name: string,
    criticism: string,
    productSerial?: string | null ,
    phoneNumber?: string | null,
    guarantyRating: number,
    repairsRating: number,
    notificationRating: number,
    personalBehaviorRating: number,
    servicesRating: number,
    smartProcessRating: number,
    callRequest: boolean
}

type ResponseType = {
    count: number,
    items: TicketType[]
}

type ParamsType = {
    page?: string | null
}


const useGetAllTickets = (params?: ParamsType) => {
    let itemsCount;
    const {data, isPending, isError} = useQuery({
        queryKey: ["AllTickets", params],
        staleTime: 10000,
        queryFn: async function() {
            const result = await axios.get<ResponseType>(INTERNAL_API, { params: params });
            return result.data;
        },
        select: (result: ResponseType) => {
            itemsCount = result.count;
            return result.items;
        }
    })

    return {
        ticketsCount: itemsCount,
        ticketsData: data,
        ticketsIsPending: isPending,
        ticketsIsError: isError
    }
}

export default useGetAllTickets;
