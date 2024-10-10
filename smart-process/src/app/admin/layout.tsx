"use client"
import AdminHeader from "@/components/headers/adminHeader";
import { useEffect } from "react";
// import Footer from "@/components/footer";
import { useAuthStore } from "@/store/useAuthStore";
import "./../globals.css";

const localStorageLoginKey = "is-logged-in";
const localStorageRuleKey = "rule";
const localPhoneNumberKey = "phone-number";

export default function AdminLayout({
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
    <div className="flex pt-12">
      <AdminHeader />
        <div className="border border-spacing-2 border-black h-screen"></div>
          {children}
        {/* <Footer /> */}
    </div>
  );
}
