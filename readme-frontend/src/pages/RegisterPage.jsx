import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = useMemo(() => {
    if (!password || !password2) return true;
    return password === password2;
  }, [password, password2]);

  const canSubmit = useMemo(() => {
    return (
      username.trim().length >= 3 &&
      password.length >= 6 &&
      passwordsMatch
    );
  }, [username, password, passwordsMatch]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await registerRequest(username.trim(), password);
      navigate("/login", { state: { username: username.trim() } });
    } catch (err) {
      setError(err?.message || "Error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-paper dark:border-white/10 dark:bg-white/5 dark:shadow-paperDark">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink dark:text-ink-dark">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-ink-muted">
            Registrate para guardar lecturas y anotaciones.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Usuario */}
          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Tu usuario"
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark dark:focus:border-white/30"
            />
            <p className="text-xs text-neutral-500 dark:text-ink-muted">
              Mínimo 3 caracteres.
            </p>
          </div>

          {/* Contraseña */}
          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark dark:focus:border-white/30"
            />
          </div>

          {/* Repetir contraseña */}
          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Repetir contraseña
            </label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Repetí tu contraseña"
              className={[
                "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none",
                passwordsMatch
                  ? "border-black/15 focus:border-black/30"
                  : "border-red-300 focus:border-red-400",
                "dark:bg-white/5 dark:text-ink-dark",
                passwordsMatch
                  ? "dark:border-white/15 dark:focus:border-white/30"
                  : "dark:border-red-400/60 dark:focus:border-red-400",
              ].join(" ")}
            />
            {!passwordsMatch && (
              <p className="text-xs font-semibold text-red-600">
                Las contraseñas no coinciden.
              </p>
            )}
          </div>

          {/* Error backend */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className={[
              "mt-1 w-full rounded-xl px-4 py-2.5 text-sm font-bold transition",
              loading || !canSubmit
                ? "cursor-not-allowed bg-black/30 text-white"
                : "bg-ink text-paper hover:opacity-90 active:scale-[0.99] dark:bg-ink-dark dark:text-paper-dark",
            ].join(" ")}
          >
            {loading ? "Creando…" : "Crear cuenta"}
          </button>

          {/* Link login */}
          <p className="text-center text-sm text-neutral-600 dark:text-ink-muted">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="font-bold text-ink hover:underline dark:text-ink-dark"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
