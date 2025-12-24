import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const [isDark, setIsDark] = useState(false);

  // Inicializa tema (localStorage → html.dark). También toma preferencia del sistema si no hay guardado.
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldBeDark = saved ? saved === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldBeDark);
    setIsDark(shouldBeDark);
  }, []);

  const toggleDark = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  const linkClass = useMemo(
    () => ({ isActive }) =>
      [
        "text-sm font-semibold transition",
        isActive
          ? "text-accent"
          : "text-ink/80 hover:text-ink dark:text-ink-muted dark:hover:text-ink-dark",
      ].join(" "),
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); // si lo usás
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-paper/80 backdrop-blur dark:border-white/10 dark:bg-paper-dark/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          {/* “sello” editorial */}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/15 bg-white/70 text-xs font-black text-ink shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-ink-dark">
            R
          </span>
          <span className="text-base font-extrabold tracking-tight text-ink dark:text-ink-dark">
            ReadMe
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-5">
          <NavLink to="/" className={linkClass}>
            Inicio
          </NavLink>

          <NavLink to="/libros" className={linkClass}>
            Libros
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/mis-lecturas" className={linkClass}>
              Mis lecturas
            </NavLink>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleDark}
            className="rounded-xl border border-black/10 bg-white/50 px-3 py-1.5 text-sm font-bold text-ink hover:bg-white/80 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-ink-dark dark:hover:bg-white/10"
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            type="button"
          >
            {isDark ? "Claro" : "Oscuro"}
          </button>

          {/* Auth */}
          {!isAuthenticated ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                [
                  "text-sm font-bold transition",
                  isActive
                    ? "text-accent"
                    : "text-ink hover:text-ink/80 dark:text-ink-dark dark:hover:text-ink-muted",
                ].join(" ")
              }
            >
              Iniciar sesión
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-xl border border-black/10 bg-ink px-3 py-1.5 text-sm font-bold text-paper hover:opacity-90 active:scale-[0.99] dark:border-white/10 dark:bg-ink-dark dark:text-paper-dark"
              title="Cerrar sesión"
              type="button"
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
