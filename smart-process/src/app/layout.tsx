"use client"
import Header from "@/components/headers/header";
import { useEffect } from "react";
import Footer from "@/components/footer";
import { useAuthStore } from "@/store/useAuthStore";
import ReactQueryProvider from "@/store/reactQueryProvider";
import "./globals.css";

const localStorageLoginKey = "is-logged-in";
const localStorageRuleKey = "rule";
const localPhoneNumberKey = "phone-number";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setRule = useAuthStore((state) => state.setRule);
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);

  useEffect(() => {
    const authState = localStorage.getItem(localStorageLoginKey);
    const rule = localStorage.getItem(localStorageRuleKey) as "user" | "admin" | null;
    const phoneNumber = localStorage.getItem(localPhoneNumberKey);
    if (authState === "1") {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    if (rule) {
      setRule(rule)
    }
    if (phoneNumber) {
      setPhoneNumber(phoneNumber)
    }
  }, [setIsAuthenticated, setRule, setPhoneNumber])

  return (
    <html lang="fa" dir="rtl" className="font-[Vazir-Medium]">
      <body
        className="bg-custom-bg bg-cover bg-center"
      >
        <ReactQueryProvider>
          <Header />
            {children}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
