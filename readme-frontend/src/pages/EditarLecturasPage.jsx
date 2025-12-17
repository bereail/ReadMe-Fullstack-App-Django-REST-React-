// src/pages/EditarLecturaPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLectura, updateLectura } from "../api/lecturas";

export default function EditarLecturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    puntuacion: "",
    comentario: "",
  });

  useEffect(() => {
    async function cargar() {
      try {
        const data = await getLectura(id);

        setForm({
          fecha_inicio: data.fecha_inicio || "",
          fecha_fin: data.fecha_fin || "",
          puntuacion: data.puntuacion ?? "",
          comentario: data.comentario || "",
        });
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar la lectura");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

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
      setError("No se pudo guardar la lectura");
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1>Editar lectura</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Fecha inicio
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={onChange}
          />
        </label>

        <label>
          Fecha fin
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={onChange}
          />
        </label>

        <label>
          Puntuación (1-5)
          <input
            type="number"
            name="puntuacion"
            min="1"
            max="5"
            value={form.puntuacion}
            onChange={onChange}
          />
        </label>

        <label>
          Comentario
          <textarea
            name="comentario"
            rows={4}
            value={form.comentario}
            onChange={onChange}
          />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => navigate("/mis-lecturas")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
