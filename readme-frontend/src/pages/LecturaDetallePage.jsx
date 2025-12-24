import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLectura } from "../api/lecturas";
import { getAnotacionesByLectura } from "../api/anotaciones";

export default function LecturaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lectura, setLectura] = useState(null);
  const [anotaciones, setAnotaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function cargar() {
      setLoading(true);
      setError("");

      try {
        const l = await getLectura(id);
        if (!mounted) return;
        setLectura(l);

        const notas = await getAnotacionesByLectura(id);
        if (!mounted) return;

        // si tu API ya devuelve normalizado, ok; si no, al menos aseguramos array
        setAnotaciones(Array.isArray(notas) ? notas : []);
      } catch (e) {
        console.error(e);
        if (mounted) setError("No se pudo cargar el detalle.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    cargar();

    return () => {
      mounted = false;
    };
  }, [id]);

  const libro = lectura?.libro || {};
  const portada =
    libro?.portada ||
    libro?.cover_url ||
    libro?.coverUrl ||
    libro?.cover ||
    null;

  const fechaInicio = lectura?.fecha_inicio || "—";
  const fechaFin = lectura?.fecha_fin || "—";
  const puntuacion = lectura?.puntuacion ?? "—";
  const comentario = lectura?.comentario?.trim() ? lectura.comentario : "Sin comentario";

  const anotacionesCount = useMemo(() => anotaciones?.length || 0, [anotaciones]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-paper dark:border-white/10 dark:bg-white/5 dark:shadow-paperDark">
          <p className="m-0 text-sm text-neutral-600 dark:text-ink-muted">Cargando…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
        <button
          type="button"
          onClick={() => navigate("/mis-lecturas")}
          className="mt-3 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-ink-dark dark:hover:bg-white/10"
        >
          ← Volver
        </button>
      </div>
    );
  }

  if (!lectura) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="m-0 text-sm text-neutral-700 dark:text-ink-muted">No encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      {/* Top bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate("/mis-lecturas")}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-neutral-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-ink-dark dark:hover:bg-white/10"
        >
          ← Volver
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(`/mis-lecturas/editar/${id}`)}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-bold hover:bg-neutral-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-ink-dark dark:hover:bg-white/10"
          >
            Editar lectura
          </button>

          <button
            type="button"
            onClick={() => navigate(`/mis-lecturas/${id}/anotaciones/nueva`)}
            className="rounded-xl bg-ink px-3 py-2 text-sm font-bold text-paper hover:opacity-90 active:scale-[0.99] dark:bg-ink-dark dark:text-paper-dark"
          >
            + Agregar anotación
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-black/10 bg-white/60 p-5 shadow-paper dark:border-white/10 dark:bg-white/5 dark:shadow-paperDark">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Cover */}
          <div className="w-full sm:w-[160px]">
            <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-black/10 bg-white/50 dark:border-white/10 dark:bg-white/5">
              {portada ? (
                <img
                  src={portada}
                  alt={libro?.titulo || "Portada"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500 dark:text-ink-muted">
                  Sin portada
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="m-0 text-xl font-extrabold tracking-tight text-ink dark:text-ink-dark">
              {libro?.titulo || "Sin título"}
            </h1>
            <p className="mt-1 text-sm text-neutral-700 dark:text-ink-muted">
              {libro?.autor || "Desconocido"}
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5">
                <p className="m-0 text-xs text-neutral-500 dark:text-ink-muted">Inicio</p>
                <p className="m-0 font-semibold">{fechaInicio}</p>
              </div>

              <div className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5">
                <p className="m-0 text-xs text-neutral-500 dark:text-ink-muted">Fin</p>
                <p className="m-0 font-semibold">{fechaFin}</p>
              </div>

              <div className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5">
                <p className="m-0 text-xs text-neutral-500 dark:text-ink-muted">Puntuación</p>
                <p className="m-0 font-semibold">{puntuacion}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="m-0 text-sm font-extrabold text-ink dark:text-ink-dark">
                Comentario
              </h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-700 dark:text-ink-muted">
                {comentario}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-5 rounded-2xl border border-black/10 bg-white/60 p-5 shadow-paper dark:border-white/10 dark:bg-white/5 dark:shadow-paperDark">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="m-0 text-base font-extrabold text-ink dark:text-ink-dark">
            Anotaciones ({anotacionesCount})
          </h3>

          <button
            type="button"
            onClick={() => navigate(`/mis-lecturas/${id}/anotaciones/nueva`)}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-bold hover:bg-neutral-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-ink-dark dark:hover:bg-white/10"
          >
            + Nueva
          </button>
        </div>

        {anotacionesCount === 0 ? (
          <div className="rounded-xl border border-black/10 bg-white/60 p-4 text-sm text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-muted">
            No hay anotaciones todavía.
          </div>
        ) : (
          <div className="grid gap-3">
            {anotaciones.map((a) => {
              const fecha = a?.creado_en ? String(a.creado_en).slice(0, 10) : "";
              const pagina = a?.pagina ? `Página ${a.pagina}` : "Sin página";
              return (
                <div
                  key={a.id}
                  className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="m-0 text-sm font-bold text-ink dark:text-ink-dark">
                      Anotación
                    </p>
                    <p className="m-0 text-xs text-neutral-500 dark:text-ink-muted">
                      {pagina}
                      {fecha ? ` • ${fecha}` : ""}
                    </p>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-800 dark:text-ink-muted">
                    {a?.texto || "—"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
