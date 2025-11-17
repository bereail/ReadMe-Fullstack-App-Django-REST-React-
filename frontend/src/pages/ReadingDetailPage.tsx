import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReading, Reading } from "../api/readings";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR");
}

export default function ReadingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchReading() {
      try {
        const data = await getReading(Number(id));
        setReading(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la lectura.");
      } finally {
        setLoading(false);
      }
    }

    fetchReading();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        Cargando lectura...
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center gap-4">
        <p>{error ?? "Lectura no encontrada."}</p>
        <button
          onClick={() => navigate("/mis-lecturas")}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400"
        >
          Volver a mis lecturas
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/mis-lecturas")}
          className="text-sm text-slate-300 hover:text-emerald-400"
        >
          ← Volver
        </button>
        <h1 className="text-xl font-semibold">Detalle de lectura</h1>
        <div />
      </header>

      <main className="px-6 py-6 max-w-4xl mx-auto space-y-6">
        <section className="flex gap-4">
          {reading.book.cover_url && (
            <img
              src={reading.book.cover_url}
              alt={reading.book.title}
              className="w-32 h-48 object-cover rounded-xl border border-slate-700"
            />
          )}
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{reading.book.title}</h2>
            {reading.book.author && (
              <p className="text-slate-400">{reading.book.author}</p>
            )}
            <p className="text-sm text-slate-500">
              Registrado: {formatDate(reading.created_at)}
            </p>

            <div className="mt-3 space-y-1 text-sm">
              <p>
                <span className="text-slate-500">Inicio:</span>{" "}
                {formatDate(reading.started_at)}
              </p>
              <p>
                <span className="text-slate-500">Fin:</span>{" "}
                {formatDate(reading.finished_at)}
              </p>
              {reading.place && (
                <p>
                  <span className="text-slate-500">Lugar:</span>{" "}
                  {reading.place}
                </p>
              )}
              {reading.rating != null && (
                <p>
                  <span className="text-slate-500">Puntaje:</span>{" "}
                  {reading.rating}/5 ⭐
                </p>
              )}
            </div>

            {reading.comment && (
              <p className="mt-3 text-sm text-slate-200 italic">
                “{reading.comment}”
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Notas</h3>
          {reading.notes && reading.notes.length > 0 ? (
            <ul className="space-y-2">
              {reading.notes.map((note) => (
                <li
                  key={note.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-sm"
                >
                  <p className="text-slate-300">{note.content}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {note.page != null && <>Página {note.page} · </>}
                    {formatDate(note.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">
              Todavía no agregaste notas a esta lectura.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
