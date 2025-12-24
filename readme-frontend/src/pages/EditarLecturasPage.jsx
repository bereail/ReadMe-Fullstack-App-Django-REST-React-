import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLectura, updateLectura } from "../api/lecturas";

export default function EditarLecturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    puntuacion: "",
    comentario: "",
  });

  useEffect(() => {
    let mounted = true;

    async function cargar() {
      setLoading(true);
      setError("");

      try {
        const data = await getLectura(id);

        if (!mounted) return;

        setForm({
          fecha_inicio: data?.fecha_inicio || "",
          fecha_fin: data?.fecha_fin || "",
          puntuacion: data?.puntuacion ?? "",
          comentario: data?.comentario || "",
        });
      } catch (e) {
        console.error(e);
        if (mounted) setError("No se pudo cargar la lectura.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    cargar();

    return () => {
      mounted = false;
    };
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const dateError = useMemo(() => {
    if (!form.fecha_inicio || !form.fecha_fin) return "";
    if (form.fecha_fin < form.fecha_inicio) return "La fecha fin no puede ser menor que la fecha inicio.";
    return "";
  }, [form.fecha_inicio, form.fecha_fin]);

  const scoreError = useMemo(() => {
    if (form.puntuacion === "" || form.puntuacion === null) return "";
    const n = Number(form.puntuacion);
    if (Number.isNaN(n)) return "La puntuación debe ser un número.";
    if (n < 1 || n > 5) return "La puntuación debe estar entre 1 y 5.";
    return "";
  }, [form.puntuacion]);

  const canSubmit = useMemo(() => {
    return !dateError && !scoreError && !saving;
  }, [dateError, scoreError, saving]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (dateError || scoreError) return;

    setSaving(true);
    try {
      await updateLectura(id, {
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
        puntuacion: form.puntuacion === "" ? null : Number(form.puntuacion),
        comentario: form.comentario || "",
      });

      navigate("/mis-lecturas");
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar la lectura.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-paper dark:border-white/10 dark:bg-white/5 dark:shadow-paperDark">
          <p className="m-0 text-sm text-neutral-600 dark:text-ink-muted">Cargando…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="rounded-2xl border border-black/10 bg-white/60 p-5 shadow-paper dark:border-white/10 dark:bg-white/5 dark:shadow-paperDark">
        <div className="mb-4">
          <h1 className="m-0 text-xl font-extrabold tracking-tight text-ink dark:text-ink-dark">
            Editar lectura
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-ink-muted">
            Actualizá fechas, puntuación y comentario.
          </p>
        </div>

        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Fecha inicio
            </label>
            <input
              type="date"
              name="fecha_inicio"
              value={form.fecha_inicio}
              onChange={onChange}
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark dark:focus:border-white/30"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Fecha fin
            </label>
            <input
              type="date"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={onChange}
              className={[
                "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none",
                dateError
                  ? "border-red-300 focus:border-red-400"
                  : "border-black/15 focus:border-black/30",
                "dark:bg-white/5 dark:text-ink-dark",
                dateError
                  ? "dark:border-red-400/60 dark:focus:border-red-400"
                  : "dark:border-white/15 dark:focus:border-white/30",
              ].join(" ")}
            />
            {dateError && (
              <p className="m-0 text-xs font-semibold text-red-600">{dateError}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Puntuación (1–5)
            </label>
            <input
              type="number"
              name="puntuacion"
              min="1"
              max="5"
              step="1"
              value={form.puntuacion}
              onChange={onChange}
              className={[
                "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none",
                scoreError
                  ? "border-red-300 focus:border-red-400"
                  : "border-black/15 focus:border-black/30",
                "dark:bg-white/5 dark:text-ink-dark",
                scoreError
                  ? "dark:border-red-400/60 dark:focus:border-red-400"
                  : "dark:border-white/15 dark:focus:border-white/30",
              ].join(" ")}
              placeholder="Ej: 5"
            />
            {scoreError && (
              <p className="m-0 text-xs font-semibold text-red-600">{scoreError}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Comentario
            </label>
            <textarea
              name="comentario"
              rows={5}
              value={form.comentario}
              onChange={onChange}
              className="w-full resize-none rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark dark:focus:border-white/30"
              placeholder="Qué te pareció, qué te dejó, etc."
            />
          </div>

          <div className="mt-1 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "rounded-xl px-4 py-2.5 text-sm font-bold text-paper transition",
                canSubmit
                  ? "bg-ink hover:opacity-90 active:scale-[0.99]"
                  : "cursor-not-allowed bg-black/25 text-white",
                "dark:bg-ink-dark dark:text-paper-dark",
              ].join(" ")}
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/mis-lecturas")}
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-neutral-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-ink-dark dark:hover:bg-white/10"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
