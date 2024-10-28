"use client"
import AdminHeader from "@/components/headers/adminHeader";
import { useEffect } from "react";
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
  const setRole = useAuthStore((state) => state.setRole);
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);

  useEffect(() => {
    const authState = localStorage.getItem(localStorageLoginKey);
    const role = localStorage.getItem(localStorageRuleKey) as "user" | "admin" | null;
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
    <div className="flex pt-12 min-h-screen">
      <AdminHeader />
          {children}
    </div>
  );
}
