import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/api";

export default function Populares() {
  const navigate = useNavigate();

  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function cargar() {
      setLoading(true);
      try {
        const data = await apiGet("/libros-populares/", { auth: false });
        if (!mounted) return;
        setLibros(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (mounted) setLibros([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    cargar();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mt-6">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Libros populares
        </h2>

        <button
          type="button"
          onClick={() => navigate("/libros")}
          className="text-sm font-semibold text-neutral-600 hover:underline dark:text-neutral-400 dark:hover:text-white"
        >
          Ver más
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
          Cargando…
        </div>
      )}

      {/* Empty */}
      {!loading && libros.length === 0 && (
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
          No hay libros populares para mostrar.
        </div>
      )}

      {/* Grid */}
      {!loading && libros.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {libros.map((libro, i) => {
            const portada =
              libro.cover_url ||
              libro.portada ||
              null;

            return (
              <button
                key={`${libro.titulo}-${i}`}
                type="button"
                onClick={() =>
                  navigate("/libro", { state: { libro } })
                }
                className="group flex flex-col gap-2 text-left"
              >
                {/* Cover */}
                <div className="aspect-[2/3] overflow-hidden rounded-xl border border-black/10 bg-white/70 transition group-hover:shadow-md dark:border-white/10 dark:bg-white/5">
                  {portada ? (
                    <img
                      src={portada}
                      alt={libro.titulo}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400 dark:text-neutral-500">
                      Sin portada
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {libro.titulo}
                  </p>
                  <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                    {libro.autor || "Desconocido"}
                  </p>
                  {libro.anio && (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-500">
                      {libro.anio}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
