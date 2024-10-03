"use client"
import Header from "@/components/header";
import { useEffect } from "react";
// import Footer from "@/components/footer";
import { useAuthStore } from "@/store/useAuthStore";
import "./globals.css";

const localStorageLoginKey = "is-logged-in"
const localStorageRuleKey = "rule"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setRule = useAuthStore((state) => state.setRule);

  useEffect(() => {
    const authState = localStorage.getItem(localStorageLoginKey);
    const rule = localStorage.getItem(localStorageRuleKey) as "user" | "admin" | null;
    if (authState === "1") {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    if (rule) {
      setRule(rule)
    }
  }, [setIsAuthenticated, setRule])

  return (
    <html lang="fa" dir="rtl" className="font-[Vazir-Medium]">
      <body
        className=""
      >
        <Header />
          {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
