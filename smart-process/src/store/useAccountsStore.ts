import { create } from "zustand";

type AccountsStoreType = {
    verifyAccountMessage?: string | null,
    loginMessage?: string | null,
    setVerifyAccountMessage: (message: string) => void,
    setLoginMessage: (message: string) => void,
}

export const useAccountsStore = create<AccountsStoreType>((set) => ({
    verifyAccountMessage: null,
    loginMessage: null,
    setVerifyAccountMessage: (message: string) => {
        set(() => ({ verifyAccountMessage: message }))
    },
    setLoginMessage: (message: string) => {
        set(() => ({ loginMessage: message }))
    }
}))
