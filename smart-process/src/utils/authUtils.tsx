"use server"
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME: string = "auth-token";
const TOKEN_MAX_AGE: number = Number(process.env.TOKEN_MAX_AGE);

export const getToken = () => {
    const authToken = cookies().get(AUTH_COOKIE_NAME);
    return authToken?.value;
}

export const setToken = (authToken: string) => {
    return cookies().set({
        name: AUTH_COOKIE_NAME,
        value: authToken,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: TOKEN_MAX_AGE
    })
}

export const deleteToken = () => {
    return cookies().delete(AUTH_COOKIE_NAME);
}