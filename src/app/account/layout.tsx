"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClienteAuth } from "@/context/ClienteAuthContext";
import AccountSidebar from "@/components/AccountSidebar";
import AppShell from "@/components/AppShell";


export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { cliente, loading } = useClienteAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !cliente) {
      router.push("/auth"); // o tu ruta de login real
    }
  }, [cliente, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Comprobando sesión...</p>
      </div>
    );
  }

  if (!cliente) return null;

  /* Solo estructura del panel, sin Header/Footer */
  return (
  <AppShell>
    <div className="flex min-h-screen bg-gray-50">
      <AccountSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  </AppShell>
);

}
