import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAnotacion } from "../api/anotaciones";

export default function NuevaAnotacionPage() {
  const { id } = useParams(); // id = lecturaId
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pagina: "",
    texto: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.texto.trim()) {
      setError("El texto de la anotación no puede estar vacío.");
      return;
    }

    if (form.pagina && Number(form.pagina) < 1) {
      setError("La página debe ser mayor a 0.");
      return;
    }

    try {
      setSaving(true);

      await createAnotacion({
        lectura: Number(id),
        pagina: form.pagina === "" ? null : Number(form.pagina),
        texto: form.texto.trim(),
      });

      navigate(`/mis-lecturas/${id}`);
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar la anotación.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="rounded-2xl border border-black/10 bg-white/60 p-5 shadow-paper dark:border-white/10 dark:bg-white/5 dark:shadow-paperDark">
        {/* Header */}
        <div className="mb-4">
          <h1 className="m-0 text-xl font-extrabold tracking-tight text-ink dark:text-ink-dark">
            Nueva anotación
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-ink-muted">
            Agregá una nota a esta lectura.
          </p>
        </div>

        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Página (opcional)
            </label>
            <input
              type="number"
              name="pagina"
              min="1"
              value={form.pagina}
              onChange={onChange}
              placeholder="Ej: 42"
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark dark:focus:border-white/30"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-ink-dark">
              Texto
            </label>
            <textarea
              name="texto"
              rows={6}
              value={form.texto}
              onChange={onChange}
              placeholder="Escribí tu anotación…"
              className="w-full resize-none rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark dark:focus:border-white/30"
            />
          </div>

          {/* Actions */}
          <div className="mt-1 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className={[
                "rounded-xl px-4 py-2.5 text-sm font-bold transition",
                saving
                  ? "cursor-not-allowed bg-black/40 text-white"
                  : "bg-ink text-paper hover:opacity-90 active:scale-[0.99] dark:bg-ink-dark dark:text-paper-dark",
              ].join(" ")}
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/mis-lecturas/${id}`)}
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
