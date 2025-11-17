import { useEffect, useState } from "react";
import { getMyReadings, Reading } from "../api/readings";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR");
}

export default function MyReadingsPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReadings() {
      try {
        const data = await getMyReadings();
        setReadings(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus lecturas.");
      } finally {
        setLoading(false);
      }
    }
    fetchReadings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">📚 Mis lecturas</h1>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="text-sm text-slate-300 hover:text-red-400"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="px-6 py-6 max-w-5xl mx-auto">
        {loading && <p>Cargando lecturas...</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {!loading && !error && readings.length === 0 && (
          <p className="text-slate-400">
            Todavía no registraste ninguna lectura.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {readings.map((reading) => (
            <article
              key={reading.id}
              onClick={() => navigate(`/lecturas/${reading.id}`)}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md cursor-pointer hover:border-emerald-500/70 transition-colors"
            >
              <div className="flex gap-3">
                {reading.book.cover_url && (
                  <img
                    src={reading.book.cover_url}
                    alt={reading.book.title}
                    className="w-16 h-24 object-cover rounded-lg border border-slate-700"
                  />
                )}
                <div>
                  <h2 className="font-semibold text-lg">
                    {reading.book.title}
                  </h2>
                  {reading.book.author && (
                    <p className="text-sm text-slate-400">
                      {reading.book.author}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Creado el {formatDate(reading.created_at)}
                  </p>
                </div>
              </div>

              <div className="text-sm text-slate-300 space-y-1">
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
                {reading.comment && (
                  <p className="text-slate-300 mt-1 line-clamp-3">
                    “{reading.comment}”
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
