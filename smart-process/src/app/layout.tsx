"use client"
import Header from "@/components/headers/header";
import { useEffect } from "react";
import Footer from "@/components/footer";
import { useAuthStore } from "@/store/useAuthStore";
import ReactQueryProvider from "@/store/reactQueryProvider";
import "./globals.css";

const localStorageLoginKey = "is-logged-in";
const localStorageRoleKey = "role";
const localPhoneNumberKey = "phone-number";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setRole = useAuthStore((state) => state.setRole);
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);

  useEffect(() => {
    const authState = localStorage.getItem(localStorageLoginKey);
    const role = localStorage.getItem(localStorageRoleKey) as "user" | "admin" | null;
    const phoneNumber = localStorage.getItem(localPhoneNumberKey);
    if (authState === "1") {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    if (role) {
      setRole(role)
    }
    if (phoneNumber) {
      setPhoneNumber(phoneNumber)
    }
  }, [setIsAuthenticated, setRole, setPhoneNumber])

  return (
    <html lang="fa" dir="rtl" className="font-[YekanBakh-SemiBold]">
      <body
        className="flex flex-col min-h-screen bg-custom-bg bg-cover bg-center"
        
      >
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <ReactQueryProvider>
          <Header />
            {children}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
