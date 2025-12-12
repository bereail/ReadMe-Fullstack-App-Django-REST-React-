// src/pages/LibroDetallePage.jsx
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
      <div>
        <p>No se encontraron datos del libro.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "10px",
          padding: "6px 10px",
          borderRadius: "4px",
          border: "1px solid #222",
          background: "white",
          cursor: "pointer",
        }}
      >
        ← Volver
      </button>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {libro.cover_url && (
          <img
            src={libro.cover_url}
            alt={libro.titulo}
            style={{ width: "180px", height: "260px", objectFit: "cover" }}
          />
        )}

        <div>
          <h1>{libro.titulo}</h1>
          <p><strong>Autor:</strong> {libro.autor}</p>
          {libro.anio && <p><strong>Año:</strong> {libro.anio}</p>}
          {/* Acá podrías agregar más info si la tenés */}
        </div>
      </div>

      {/* Componente para guardar lectura */}
       {isAuthenticated && (
        <GuardarLectura libro={libro} />
      )}
    </div>
  );
}
