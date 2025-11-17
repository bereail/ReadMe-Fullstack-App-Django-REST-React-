// src/pages/LoginPage.tsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 🔹 Intento real de login contra tu backend
      const res = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      console.log("Login OK", res.data);
      login(res.data.token);

      // 🔹 Si todo sale bien → vamos a mis lecturas
      navigate("/mis-lecturas");
    } catch (err) {
      console.error("Error en login:", err);
      setError("No se pudo iniciar sesión (demo).");

      // 🔹 MODO DEMO: igual dejame entrar para poder mostrar la app
      navigate("/mis-lecturas");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-900">
          ReadMe — Iniciar sesión
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-3 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1 text-slate-800">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-800">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold text-sm mt-2 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
