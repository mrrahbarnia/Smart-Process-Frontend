"use client"
import { create } from "zustand";

const localStorageLoginKey = "is-logged-in";
const localStorageRoleKey = "role";
const localPhoneNumberKey = "phone-number";

type AuthStoreType = {
    role: "user" | "admin" | null,
    phoneNumber: string | null,
    isAuthenticated: boolean,
    setIsAuthenticated: (authState: boolean) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    login: () => void,
    setRole: (rule: "user" | "admin") => void,
    logout: () => void,
}


export const useAuthStore = create<AuthStoreType>((set) => ({
    role: null,
    isAuthenticated: false,
    phoneNumber: null,
    setIsAuthenticated: (authState: boolean) => {
        set(() => ({ isAuthenticated: authState }))
    },
    login: () => {
        localStorage.setItem(localStorageLoginKey, "1")
        set(() => ({ isAuthenticated: true }))
    },
    setRole: (role: "user" | "admin") => {
        localStorage.setItem(localStorageRoleKey, role)
        set(() => ({ role: role }))
    },
    setPhoneNumber: (phoneNumber: string) => {
        localStorage.setItem(localPhoneNumberKey, phoneNumber);
        set(() => ({ phoneNumber: phoneNumber }))
    },
    logout: () => {
        localStorage.removeItem(localStorageRoleKey);
        localStorage.removeItem(localPhoneNumberKey);
        localStorage.setItem(localStorageLoginKey, "0");
        set(() => ({ isAuthenticated: false }))
    }
}))
