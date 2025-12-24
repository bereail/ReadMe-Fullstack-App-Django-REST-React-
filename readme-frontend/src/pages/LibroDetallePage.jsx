import { useLocation, useNavigate } from "react-router-dom";
import GuardarLectura from "../components/libros/GuardarLectura";

export default function LibroDetallePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const libro = state?.libro;

  const token = localStorage.getItem("accessToken");
  const isAuthenticated = !!token && token !== "null" && token !== "undefined";

  if (!libro) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            No se encontraron datos del libro.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-3 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-neutral-100 dark:hover:bg-white/10"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  const portada =
    libro.cover_url ||
    libro.portada ||
    libro.cover ||
    null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      {/* Volver */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-neutral-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-neutral-100 dark:hover:bg-white/10"
      >
        ← Volver
      </button>

      {/* Card principal */}
      <div className="rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-5 sm:flex-row">
          {/* Portada */}
          <div className="w-full sm:w-[200px]">
            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
              {portada ? (
                <img
                  src={portada}
                  alt={libro.titulo}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500 dark:text-neutral-400">
                  Sin portada
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              {libro.titulo}
            </h1>

            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              <strong>Autor:</strong> {libro.autor || "Desconocido"}
            </p>

            {libro.anio && (
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                <strong>Año:</strong> {libro.anio}
              </p>
            )}

            {/* Acciones */}
            {isAuthenticated && (
              <div className="mt-5">
                <GuardarLectura libro={libro} />
              </div>
            )}

            {!isAuthenticated && (
              <p className="mt-5 text-sm text-neutral-500 dark:text-neutral-400">
                Iniciá sesión para guardar este libro en tu historial.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
