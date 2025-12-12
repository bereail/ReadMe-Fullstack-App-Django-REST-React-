import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { guardarLecturaApi } from "../../api/lecturas";

export default function GuardarLectura({ libro }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [lugar, setLugar] = useState("");
  const [puntaje, setPuntaje] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validación simple de fechas
    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      setError("La fecha de fin no puede ser anterior a la de inicio");
      return;
    }

   const payload = {
  titulo: libro.titulo,
  autor: libro.autor,
  anio: libro.anio ?? null,

  // ✅ asegurar portada
  portada: libro.cover_url || libro.portada || null,

  fecha_inicio: fechaInicio || null,
  fecha_fin: fechaFin || null,
  lugar_finalizacion: lugar || null,
  puntuacion: puntaje ? Number(puntaje) : null,
  comentario: comentario || null,
};

    console.log("PAYLOAD A ENVIAR:", payload);

    setLoading(true);
    try {
      await guardarLecturaApi(payload);
      navigate("/mis-lecturas");
    } catch (err) {
      console.error("ERROR GUARDAR:", err);
      setError(err.message || "No se pudo guardar la lectura.");
    } finally {
      setLoading(false);
    }
  }

  if (!libro) return <p>No hay libro seleccionado para guardar.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Guardar lectura</h3>

      <p>
        <strong>Libro:</strong> {libro.titulo} — {libro.autor}
      </p>

      <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
      <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
      <input type="text" placeholder="Lugar" value={lugar} onChange={e => setLugar(e.target.value)} />
      <input type="number" min="1" max="5" value={puntaje} onChange={e => setPuntaje(e.target.value)} />
      <textarea rows={3} placeholder="Comentario" value={comentario} onChange={e => setComentario(e.target.value)} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar lectura"}
      </button>
    </form>
  );
}
