"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../lib/auth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const path = usePathname();

  useEffect(() => {
    if (!auth.access()) {
      router.replace("/login");
    } else {
      setOk(true);
    }
  }, [path]);

  if (!ok) return null;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">ReadMe Dashboard</h1>
        <button
          className="text-sm underline"
          onClick={() => { auth.clear(); router.replace("/login"); }}
        >
          Cerrar sesión
        </button>
      </header>
      {children}
    </div>
  );
}
