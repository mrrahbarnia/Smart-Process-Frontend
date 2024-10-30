"use server"
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { EXTERNAL_BASE_ENDPOINT } from '@/configs/default';

const EXTERNAL_API = `${EXTERNAL_BASE_ENDPOINT}/articles/article-detail`;

export const GET = async (request: NextRequest, {params}: {params: {articleId: string}}) => {
    const articleId = params.articleId;

    try {
        const result = await axios.get(`${EXTERNAL_API}/${articleId}/`)
        return NextResponse.json(result.data, {status: 200})
    } catch {
        return NextResponse.json({"message": "There is no article with the provided ID!"}, {status: 400})
    }
};
