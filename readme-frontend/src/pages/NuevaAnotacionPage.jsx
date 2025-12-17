import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAnotacion } from "../api/anotaciones";

export default function NuevaAnotacionPage() {
  const { id } = useParams(); // id = lecturaId
  const navigate = useNavigate();

  const [form, setForm] = useState({ pagina: "", texto: "" });
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

    try {
      setSaving(true);

      await createAnotacion({
        lectura: Number(id),
        pagina: form.pagina === "" ? null : Number(form.pagina),
        texto: form.texto,
      });

      navigate(`/mis-lecturas/${id}`); // vuelve al detalle
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar la anotación.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1>Nueva anotación</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Página (opcional)
          <input
            type="number"
            name="pagina"
            value={form.pagina}
            onChange={onChange}
            min="1"
          />
        </label>

        <label>
          Texto
          <textarea
            name="texto"
            rows={6}
            value={form.texto}
            onChange={onChange}
          />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/mis-lecturas/${id}`)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
