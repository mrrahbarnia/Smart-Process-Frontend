"use server"
import { NextResponse } from "next/server";
import { deleteToken } from "@/utils/authUtils";


export const DELETE = async () => {
    deleteToken();
    return NextResponse.json({status: 204})
}