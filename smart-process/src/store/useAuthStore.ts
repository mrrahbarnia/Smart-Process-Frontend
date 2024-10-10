"use client"
import { create } from "zustand";

const localStorageLoginKey = "is-logged-in";
const localStorageRuleKey = "rule";
const localPhoneNumberKey = "phone-number";

type AuthStoreType = {
    rule: "user" | "admin" | null,
    phoneNumber: string | null,
    isAuthenticated: boolean,
    setIsAuthenticated: (authState: boolean) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    login: () => void,
    setRule: (rule: "user" | "admin") => void,
    logout: () => void,
}


export const useAuthStore = create<AuthStoreType>((set) => ({
    rule: null,
    isAuthenticated: false,
    phoneNumber: null,
    setIsAuthenticated: (authState: boolean) => {
        set(() => ({ isAuthenticated: authState }))
    },
    login: () => {
        localStorage.setItem(localStorageLoginKey, "1")
        set(() => ({ isAuthenticated: true }))
    },
    setRule: (rule: "user" | "admin") => {
        localStorage.setItem(localStorageRuleKey, rule)
        set(() => ({ rule: rule }))
    },
    setPhoneNumber: (phoneNumber: string) => {
        localStorage.setItem(localPhoneNumberKey, phoneNumber);
        set(() => ({ phoneNumber: phoneNumber }))
    },
    logout: () => {
        localStorage.removeItem(localStorageRuleKey);
        localStorage.removeItem(localPhoneNumberKey);
        localStorage.setItem(localStorageLoginKey, "0");
        set(() => ({ isAuthenticated: false }))
    }
}))
