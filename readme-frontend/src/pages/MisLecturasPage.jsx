// readme-frontend/src/pages/MisLecturasPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMisLecturas, deleteLectura } from "../api/lecturas";
import StarRating from "../components/ui/StarRating";
export default function MisLecturasPage() {
  const [lecturas, setLecturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function cargarLecturas() {
      try {
        const data = await getMisLecturas();
        setLecturas(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus lecturas");
      } finally {
        setLoading(false);
      }
    }

    cargarLecturas();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("¿Seguro que querés eliminar esta lectura?")) return;

    try {
      await deleteLectura(id);
      setLecturas((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la lectura");
    }
  }

  if (loading) return <p>Cargando lecturas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Mis Lecturas</h1>
      <p>Todos los libros que guardaste aparecen acá.</p>

      {lecturas.length === 0 ? (
        <p>No tenés lecturas guardadas todavía.</p>
      ) : (
        <ul style={{ marginTop: "20px", padding: 0 }}>
          {lecturas.map((l) => {
            const portada = l.libro?.portada || null;

            return (
              <li
                key={l.id}
                style={{
                  listStyle: "none",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  gap: "14px",
                }}
              >
                {portada ? (
                  <img
                    src={portada}
                    alt={l.libro.titulo}
                    style={{
                      width: "60px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "60px",
                      height: "90px",
                      background: "#eee",
                      borderRadius: "6px",
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <strong>{l.libro.titulo}</strong> — {l.libro.autor}

<div style={{ marginTop: 4 }}>
  <StarRating value={l.puntuacion || 0} />


</div>

                  <br />
                  <small>
                    Inicio: {l.fecha_inicio || "—"} | Fin:{" "}
                    {l.fecha_fin || "—"}
                  </small>
                  <button onClick={() => navigate(`/mis-lecturas/${l.id}`)}>
  Ver detalles
</button>

                  <div style={{ marginTop: "8px" }}>
                    <button
                      onClick={() =>
                        navigate(`/mis-lecturas/editar/${l.id}`)
                      }
                      style={{ marginRight: "8px" }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(l.id)}
                      style={{ color: "red" }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
