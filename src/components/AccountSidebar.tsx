"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/account/info", label: "Información" },
  { href: "/account/orders", label: "Historial de pedidos" },
  { href: "/account/coupons", label: "Vales" },
  { href: "/account/alerts", label: "Mis alertas" },
  { href: "/account/cookies", label: "Configuración de cookies" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Mi cuenta</h2>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-2 rounded-md hover:bg-gray-100 ${pathname === link.href ? "bg-gray-100 font-medium" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
