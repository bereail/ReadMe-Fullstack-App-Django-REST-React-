"use client";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { auth } from "@/app/lib/auth";
import { useRouter } from "next/navigation";

type Lectura = {
  id: number;
  titulo: string;
  autor?: string;
  rating?: number;
  created_at: string;
};

export default function LecturasPage() {
  const router = useRouter();
  const [data, setData] = useState<Lectura[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ titulo: string; autor?: string; rating?: number }>({ titulo: "" });

  // Guardia simple: si no hay token -> login
  useEffect(() => {
    if (!auth.access()) router.replace("/login");
  }, [router]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<Lectura[]>("/lecturas/");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (auth.access()) load(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo?.trim()) return;
    await api.post("/lecturas/", form);
    setForm({ titulo: "" });
    load();
  };

  const onDelete = async (id: number) => {
    await api.delete(`/lecturas/${id}/`);
    load();
  };

  if (!auth.access()) return null;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Mis lecturas</h1>
        <button
          className="text-sm underline"
          onClick={() => { auth.clear(); router.replace("/login"); }}
        >
          Cerrar sesión
        </button>
      </header>

      {/* Form crear */}
      <form onSubmit={onCreate} className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1"
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />
        <input
          className="border p-2 w-48"
          placeholder="Autor"
          value={form.autor ?? ""}
          onChange={(e) => setForm({ ...form, autor: e.target.value })}
        />
        <input
          className="border p-2 w-24"
          type="number"
          placeholder="Rating"
          value={form.rating ?? ""}
          onChange={(e) => setForm({ ...form, rating: e.target.value ? Number(e.target.value) : undefined })}
        />
        <button className="bg-black text-white px-4">Agregar</button>
      </form>

      {/* Tabla */}
      {loading ? (
        <p>Cargando…</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Título</th>
              <th className="p-2">Autor</th>
              <th className="p-2">Rating</th>
              <th className="p-2 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{l.titulo}</td>
                <td className="p-2 text-center">{l.autor ?? "-"}</td>
                <td className="p-2 text-center">{l.rating ?? "-"}</td>
                <td className="p-2 text-center">
                  <button className="underline text-red-600" onClick={() => onDelete(l.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td className="p-2" colSpan={4}>Sin lecturas aún.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}
