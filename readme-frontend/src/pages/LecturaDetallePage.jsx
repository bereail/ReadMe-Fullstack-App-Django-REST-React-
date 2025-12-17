import { useEffect, useState } from "react";
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
    async function cargar() {
      try {
        const l = await getLectura(id);
        setLectura(l);

        const notas = await getAnotacionesByLectura(id);
        setAnotaciones(notas);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el detalle");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!lectura) return <p>No encontrado</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => navigate("/mis-lecturas")}>← Volver</button>

      <h1 style={{ marginTop: 10 }}>{lectura.libro?.titulo}</h1>
      <p>{lectura.libro?.autor}</p>

      <p>
        Inicio: {lectura.fecha_inicio || "—"} | Fin: {lectura.fecha_fin || "—"}
      </p>

      <p>
        <strong>Puntuación:</strong> {lectura.puntuacion ?? "—"}
      </p>

      <div style={{ marginTop: 12 }}>
        <h3>Comentario</h3>
        <p>{lectura.comentario || "Sin comentario"}</p>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Anotaciones ({anotaciones.length})</h3>

        {anotaciones.length === 0 ? (
          <p>No hay anotaciones todavía.</p>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {anotaciones.map((a) => (
              <li key={a.id} style={{ marginBottom: 10 }}>
                <strong>Anotación</strong>
                <br />
                <small>
                  {a.pagina ? `Página ${a.pagina}` : "Sin página"}
                  {a.creado_en ? ` • ${a.creado_en.slice(0, 10)}` : ""}
                </small>
                <div>{a.texto}</div>
              </li>
            ))}
          </ul>
        )}

        <button onClick={() => navigate(`/mis-lecturas/${id}/anotaciones/nueva`)}>
          + Agregar anotación
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        <button onClick={() => navigate(`/mis-lecturas/editar/${id}`)}>
          Editar lectura
        </button>
      </div>
    </div>
  );
}
