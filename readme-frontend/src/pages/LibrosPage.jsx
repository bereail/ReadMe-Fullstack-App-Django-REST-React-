import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SearchBar from "../components/libros/SearchBar";
import SearchResults from "../components/libros/SearchResults";

import { buscarLibrosPorSubject, buscarLibrosPorNombre } from "../api/libros";
import { guardarLecturaApi } from "../api/lecturas";
import { normalizeLibros, normalizeLibro } from "../adapters/librosAdapter";

const SUBJECTS = [
  { key: "classic_literature", label: "Clásicos" },
  { key: "fantasy", label: "Fantasía" },
  { key: "science_fiction", label: "Sci-Fi" },
  { key: "mystery", label: "Misterio" },
  { key: "romance", label: "Romance" },
  { key: "horror", label: "Terror" },
];

export default function LibrosPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const token = localStorage.getItem("accessToken");
  const isAuthenticated = !!token && token !== "null" && token !== "undefined";

  // ✅ leer desde URL
  const qFromUrl = searchParams.get("q") || "";
  const subjectFromUrl = searchParams.get("subject") || "";

  // ✅ estados UI
  const [query, setQuery] = useState(qFromUrl);
  const [selectedSubject, setSelectedSubject] = useState(subjectFromUrl);

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasQuery = useMemo(() => query.trim().length > 0, [query]);
  const hasResults = resultados.length > 0;

  // ✅ mantener sincronizado si cambia la URL
  useEffect(() => setQuery(qFromUrl), [qFromUrl]);
  useEffect(() => setSelectedSubject(subjectFromUrl), [subjectFromUrl]);

  async function cargarSubject(subjectKey) {
    if (!subjectKey) return;

    setLoading(true);
    setError("");
    setResultados([]);

    try {
      // ✅ buscar por subject (api ya normaliza)
      const normalizados = await buscarLibrosPorSubject(subjectKey, { page: 1, limit: 8 });
      setResultados(normalizados);

      if (normalizados.length === 0) {
        setError("No hay resultados para esta categoría.");
      }
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar la categoría. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function manejarBusqueda(nextQ) {
    const q = (nextQ ?? query).trim();
    if (!q) return;

    setLoading(true);
    setError("");
    setResultados([]);
    setSelectedSubject(""); // ✅ si buscás texto, ya no hay subject

    try {
      // ✅ reflejar en URL
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set("q", q);
        p.delete("subject");
        return p;
      });

      // ⚠️ si buscarLibrosPorNombre YA devuelve normalizado, sacá normalizeLibros()
      const data = await buscarLibrosPorNombre(q);
      const normalizados = Array.isArray(data) ? normalizeLibros(data) : [];
      setResultados(normalizados);

      if (normalizados.length === 0) {
        setError("No encontramos resultados. Probá con otro término.");
      }
    } catch (e) {
      console.error(e);
      setError("No se pudo buscar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ auto-buscar si venís con /libros?q=...
  useEffect(() => {
    if (qFromUrl.trim()) {
      manejarBusqueda(qFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qFromUrl]);

  // ✅ auto-cargar si venís con /libros?subject=...
  useEffect(() => {
    if (subjectFromUrl.trim() && !qFromUrl.trim()) {
      // si hay q, priorizamos q; si no, subject
      cargarSubject(subjectFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFromUrl]);

  function manejarVer(libro) {
    navigate("/libro", { state: { libro } });
  }

  async function manejarGuardar(libro) {
    if (!isAuthenticated) return navigate("/login");

    try {
      const libroNormalizado = normalizeLibro(libro);
      await guardarLecturaApi(libroNormalizado, {});
      navigate("/mis-lecturas");
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar la lectura.");
    }
  }

  const limpiar = () => {
    setQuery("");
    setSelectedSubject("");
    setResultados([]);
    setError("");
    setSearchParams({}); // ✅ limpia URL
  };

  const onSelectSubject = (subjectKey) => {
    setSelectedSubject(subjectKey);
    setQuery(""); // ✅ importante: no mezclar texto con subject

    // ✅ reflejar en URL
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("subject", subjectKey);
      p.delete("q");
      return p;
    });

    // ✅ ACÁ estaba el bug: faltaba llamar al fetch
    cargarSubject(subjectKey);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Explorar libros
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Buscá por título, autor o ISBN. Usá categorías para inspirarte.
        </p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="grid gap-3">
          <SearchBar value={query} onChange={setQuery} onSubmit={() => manejarBusqueda()} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Categorías:
            </span>

            {SUBJECTS.map((s) => {
              const active = selectedSubject === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => onSelectSubject(s.key)}
                  className={[
                    "rounded-full border px-3 py-2 text-xs font-semibold transition",
                    active
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-black/15 bg-white hover:bg-neutral-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              );
            })}

            <div className="flex-1" />

            {(hasQuery || hasResults || error || selectedSubject) && (
              <button
                type="button"
                onClick={limpiar}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                Limpiar
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <div className="rounded-xl border border-black/10 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
              Iniciá sesión para poder <b>guardar</b> libros.
            </div>
          )}
        </div>
      </section>

      <section className="mt-5">
        {loading && (
          <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
            Cargando…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && !hasResults && (
          <div className="rounded-2xl border border-black/10 bg-white/60 p-6 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
            <p className="m-0">
              Escribí arriba o elegí una categoría. Ejemplos: <b>Borges</b>,{" "}
              <b>Dune</b>, <b>Harry Potter</b> o un <b>ISBN</b>.
            </p>
          </div>
        )}

        {!loading && hasResults && (
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
                Resultados: <b>{resultados.length}</b>
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm font-semibold text-black/70 hover:text-black hover:underline dark:text-neutral-300 dark:hover:text-white"
              >
                Volver a Inicio
              </button>
            </div>

            <SearchResults
              resultados={resultados}
              onVer={manejarVer}
              onGuardar={manejarGuardar}
              puedeGuardar={isAuthenticated}
            />
          </div>
        )}
      </section>
    </div>
  );
}
