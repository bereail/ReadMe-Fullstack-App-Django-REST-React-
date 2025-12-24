import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import HorizontalCarousel from "../components/ui/HorizontalCarousel";
import LibroCard from "../components/libros/LibroCard";
import { useInfiniteList } from "../hooks/useInfiniteHorizontalList";

import {
  getLibrosClasicos,
  getLibrosFantasy,
  getLibrosScifi,
  getLibrosMejorPuntuados,
} from "../services/librosService";

import { guardarLecturaApi } from "../api/lecturas";

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const [q, setQ] = useState("");

  const refClasicos = useRef(null);
  const refFantasy = useRef(null);
  const refScifi = useRef(null);
  const refTop = useRef(null);

  // Secciones públicas
  const clasicos = useInfiniteList(getLibrosClasicos, [], { limit: 5 });
  const fantasy = useInfiniteList(getLibrosFantasy, [], { limit: 5 });
  const scifi = useInfiniteList(getLibrosScifi, [], { limit: 5 });

  // Privada (hook siempre se llama; no request si no hay login)
  const top = useInfiniteList(
    async (params) => {
      if (!isAuthenticated) return { results: [], has_more: false };
      return getLibrosMejorPuntuados(params);
    },
    [isAuthenticated],
    { limit: 6 }
  );

  const canSearch = useMemo(() => q.trim().length > 0, [q]);

  // ✅ REDIRECCIÓN CORRECTA
  const onBuscar = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/libros?q=${encodeURIComponent(query)}`);
  };

  const onEscanearISBN = () => navigate("/scan");

  const onVer = (libro) => navigate("/libro", { state: { libro } });

  const onGuardar = async (libro) => {
    if (!isAuthenticated) return navigate("/login");
    await guardarLecturaApi(libro);
    navigate("/mis-lecturas");
  };

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderSection = (title, state, puedeGuardar = isAuthenticated) => (
    <div className="mt-6">
      <HorizontalCarousel
        title={title}
        onEndReached={state.loadMore}
        loading={state.loading}
        hasMore={state.hasMore}
      >
        {state.items.map((libro, i) => (
          <LibroCard
            key={`${title}-${i}`}
            data={libro}
            onVer={onVer}
            onGuardar={onGuardar}
            puedeGuardar={puedeGuardar}
          />
        ))}

        {state.loading && (
          <p className="px-2 py-2 text-sm text-neutral-600">Cargando…</p>
        )}
        {state.error && (
          <p className="px-2 py-2 text-sm text-red-600">{state.error}</p>
        )}
        {!state.loading && !state.hasMore && state.items.length > 0 && (
          <p className="px-2 py-2 text-sm text-neutral-500">No hay más.</p>
        )}
      </HorizontalCarousel>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* HERO */}
      <section className="rounded-2xl border border-black/10 bg-gradient-to-b from-black/[0.04] to-transparent p-4 md:p-5">
        <div className="flex flex-col gap-3">
          {/* SEARCH */}
          <form onSubmit={onBuscar} className="flex items-stretch gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título, autor o ISBN…"
              className="w-full flex-1 rounded-xl border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black/30"
            />

            <button
              type="submit"
              disabled={!canSearch}
              className={[
                "rounded-xl px-4 py-3 text-sm font-bold text-white",
                canSearch
                  ? "bg-black hover:bg-black/90 active:scale-[0.99]"
                  : "cursor-not-allowed bg-black/25",
              ].join(" ")}
            >
              Buscar
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="m-0 text-xs text-neutral-500">
              Tip: probá con <b>Borges</b>, <b>Dune</b> o un <b>ISBN</b>.
            </p>

            <button
              type="button"
              onClick={onEscanearISBN}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-bold hover:bg-neutral-50 active:scale-[0.99]"
            >
              Escanear ISBN
            </button>
          </div>

          <div className="h-px w-full bg-black/10" />

          {/* CHIPS */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-neutral-500">Explorar:</span>

            <button
              type="button"
              onClick={() => navigate("/libros?subject=classic_literature")}
              className="rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
            >
              Clásicos
            </button>

            <button
              type="button"
              onClick={() => navigate("/libros?subject=fantasy")}
              className="rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
            >
              Fantasía
            </button>

            <button
              type="button"
              onClick={() => navigate("/libros?subject=science_fiction")}
              className="rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
            >
              Sci-Fi
            </button>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => scrollToRef(refTop)}
                className="rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
              >
                Tu Top ⭐
              </button>
            )}

            <div className="flex-1" />

            <button
              type="button"
              onClick={() => navigate("/libros")}
              className="rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
            >
              Explorar todo →
            </button>
          </div>
        </div>
      </section>

      {/* SECCIONES */}
      <div ref={refClasicos}>{renderSection("Clásicos", clasicos, false)}</div>
      <div ref={refFantasy}>{renderSection("Fantasía", fantasy, false)}</div>
      <div ref={refScifi}>{renderSection("Sci-Fi", scifi, false)}</div>

      {/* PRIVADA */}
      <div ref={refTop} className="mt-6">
        {isAuthenticated ? (
          renderSection("Tu Top ⭐", top, true)
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="m-0 text-base font-bold">Tu Top ⭐ (solo con cuenta)</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Iniciá sesión para ver tus lecturas mejor puntuadas.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white hover:bg-black/90"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-neutral-50"
              >
                Crear cuenta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
