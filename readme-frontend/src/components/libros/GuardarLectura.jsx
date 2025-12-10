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
  const isAuthenticated = !!localStorage.getItem("accessToken");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await guardarLecturaApi(libro, {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        lugar,
        puntaje: puntaje ? Number(puntaje) : null,
        comentario,
      });

      navigate("/mis-lecturas");
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo guardar la lectura.");
    } finally {
      setLoading(false);
    }
  }

  if (!libro) {
    return <p>No hay libro seleccionado para guardar.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "20px",
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#f9f9f9",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Guardar lectura</h3>

      <p style={{ fontSize: "14px", marginBottom: "10px" }}>
        <strong>Libro:</strong> {libro.titulo} — {libro.autor}
      </p>

      <div style={{ display: "grid", gap: "8px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px" }}>
            Fecha de inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px" }}>
            Fecha de fin
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px" }}>
            Lugar donde lo terminaste
          </label>
          <input
            type="text"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="Casa, viaje, café, etc."
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px" }}>
            Puntaje (1 a 5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={puntaje}
            onChange={(e) => setPuntaje(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px" }}>
            Comentario
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={3}
            placeholder="Qué te pareció, cómo te sentiste, etc."
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
        </div>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: "12px",
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "none",
          background: "#222",
          color: "white",
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Guardando..." : "Guardar lectura"}
      </button>
    </form>
  );
}
