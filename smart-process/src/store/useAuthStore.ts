"use client"
import { create } from "zustand";

const localStorageLoginKey = "is-logged-in"
const localStorageRuleKey = "rule"

type AuthStoreType = {
    rule: "user" | "admin" | null,
    isAuthenticated: boolean,
    setIsAuthenticated: (authState: boolean) => void;
    login: () => void,
    setRule: (rule: "user" | "admin") => void,
    logout: () => void,
}


export const useAuthStore = create<AuthStoreType>((set) => ({
    rule: null,
    isAuthenticated: false,
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
    logout: () => {
        localStorage.removeItem(localStorageRuleKey);
        localStorage.setItem(localStorageLoginKey, "0");
        set(() => ({ isAuthenticated: false }))
    }
}))
