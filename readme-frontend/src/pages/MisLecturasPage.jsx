import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMisLecturas } from "../api/lecturas";

export default function MisLecturasPage() {
  const [lecturas, setLecturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function cargarLecturas() {
      try {
        const data = await obtenerMisLecturas();
        console.log("LECTURAS:", data); // 👈 útil para debug
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

  if (loading) return <p>Cargando lecturas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Mis Lecturas</h1>
      <p>Todos los libros que guardaste aparecen acá.</p>

      {lecturas.length === 0 ? (
        <p>No tenés lecturas guardadas todavía.</p>
      ) : (
        <ul style={{ marginTop: "20px", padding: 0 }}>
          {lecturas.map((l) => {
            // 👇 fallback por si viene con otro nombre
            const portada = l.portada || l.cover_url || null;

            return (
              <li
                key={l.lectura_id}
                style={{
                  listStyle: "none",
                  marginBottom: "14px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                {portada ? (
                  <img
                    src={portada}
                    alt={l.titulo}
                    style={{
                      width: "60px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                    onError={(e) => {
                      // Si la URL falla, ocultamos la imagen
                      e.currentTarget.style.display = "none";
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

                <div>
                  <strong>{l.titulo}</strong> — {l.autor}
                  <br />
                  <small>
                    Inicio: {l.fecha_inicio || "—"} | Fin:{" "}
                    {l.fecha_fin || "—"}
                  </small>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
