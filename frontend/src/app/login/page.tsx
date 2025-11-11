"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "@/app/lib/api";
import { auth } from "@/app/lib/auth";
import { setRefreshToken } from "@/app/lib/api";
import { useRouter } from "next/navigation";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState:{ isSubmitting, errors } } = useForm<Form>();
  const router = useRouter();

  const onSubmit = async (data: Form) => {
    const res = await api.post("/auth/login/", data);
    const { access, refresh } = res.data;
    auth.set(access, refresh);
    setRefreshToken(refresh);
    // setear auth header global
    (api.defaults.headers as any).common["Authorization"] = `Bearer ${access}`;
    router.push("/lecturas");
  };

  return (
    <main className="max-w-sm mx-auto pt-24">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Usuario" {...register("username")} />
        <input className="border p-2 w-full" type="password" placeholder="Contraseña" {...register("password")} />
        <button disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded">
          {isSubmitting ? "Ingresando..." : "Entrar"}
        </button>
      </form>
      {errors.root?.message && <p className="text-red-600">{errors.root.message}</p>}
    </main>
  );
}
