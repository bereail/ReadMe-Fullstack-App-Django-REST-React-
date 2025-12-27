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
  const token = localStorage.getItem("accessToken");
  const isAuthenticated = !!token && token !== "null" && token !== "undefined";

  const [q, setQ] = useState("");

  const refClasicos = useRef(null);
  const refFantasy = useRef(null);
  const refScifi = useRef(null);
  const refTop = useRef(null);

  const clasicos = useInfiniteList(getLibrosClasicos, [], { limit: 5 });
  const fantasy = useInfiniteList(getLibrosFantasy, [], { limit: 5 });
  const scifi = useInfiniteList(getLibrosScifi, [], { limit: 5 });

  const top = useInfiniteList(
    async (params) => {
      if (!isAuthenticated) return { results: [], has_more: false };
      return getLibrosMejorPuntuados(params);
    },
    [isAuthenticated],
    { limit: 6 }
  );

  const canSearch = useMemo(() => q.trim().length > 0, [q]);

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

  const renderSection = (title, subjectKey, state, puedeGuardar = isAuthenticated) => (
    <div className="section">
      <div className="sectionHeader">
        <h3 className="sectionTitle">{title}</h3>

        <button
          type="button"
          onClick={() => navigate(`/libros?subject=${encodeURIComponent(subjectKey)}`)}
          style={{ color: "var(--muted)", fontSize: 12 }}
        >
          Ver más
        </button>
      </div>

      <HorizontalCarousel
        title={null}
        onEndReached={state.loadMore}
        loading={state.loading}
        hasMore={state.hasMore}
      >
        {state.items.map((libro, i) => (
          <LibroCard
            key={`${subjectKey}-${i}`}
            data={libro}
            onVer={onVer}
            onGuardar={onGuardar}
            puedeGuardar={puedeGuardar}
          />
        ))}

        {state.loading && (
          <p style={{ padding: "8px 4px", fontSize: 12, color: "var(--muted)" }}>
            Cargando…
          </p>
        )}

        {state.error && state.items.length === 0 && (
          <div style={{ padding: "8px 4px" }}>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
              Contenido temporalmente no disponible.
            </p>
            <button
              type="button"
              onClick={state.loadMore}
              style={{
                marginTop: 8,
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.06)",
                color: "var(--text)",
                fontSize: 12,
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {!state.loading && !state.hasMore && state.items.length > 0 && (
          <p style={{ padding: "8px 4px", fontSize: 12, color: "var(--muted)" }}>
            No hay más.
          </p>
        )}
      </HorizontalCarousel>
    </div>
  );

  return (
    <div className="page">
      <div className="app-container">
        <div className="topbar">
          <div className="brand">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: "1px solid var(--border)",
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              R
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 800 }}>ReadMe</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Tu biblioteca</div>
            </div>
          </div>

          <form onSubmit={onBuscar} className="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título, autor o ISBN…"
            />
            <button type="submit" disabled={!canSearch}>
              Buscar
            </button>
          </form>

          <button
            type="button"
            onClick={onEscanearISBN}
            style={{
              padding: "12px 14px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.06)",
              color: "var(--text)",
              fontWeight: 700,
            }}
          >
            Escanear
          </button>
        </div>

        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" onClick={() => scrollToRef(refClasicos)} style={chipStyle()}>
            Clásicos
          </button>
          <button type="button" onClick={() => scrollToRef(refFantasy)} style={chipStyle()}>
            Fantasía
          </button>
          <button type="button" onClick={() => scrollToRef(refScifi)} style={chipStyle()}>
            Sci-Fi
          </button>

          {isAuthenticated && (
            <button type="button" onClick={() => scrollToRef(refTop)} style={chipStyle()}>
              Tu Top ⭐
            </button>
          )}

          <div style={{ flex: 1 }} />

          <button type="button" onClick={() => navigate("/libros")} style={chipStyle(true)}>
            Explorar todo →
          </button>
        </div>

        <div ref={refClasicos}>{renderSection("Clásicos", "classic_literature", clasicos, false)}</div>
        <div ref={refFantasy}>{renderSection("Fantasía", "fantasy", fantasy, false)}</div>
        <div ref={refScifi}>{renderSection("Sci-Fi", "science_fiction", scifi, false)}</div>

        <div ref={refTop}>
          {isAuthenticated ? (
            renderSection("Tu Top ⭐", "top", top, true)
          ) : (
            <div
              style={{
                marginTop: 22,
                padding: 16,
                borderRadius: 18,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16 }}>Tu Top ⭐ (solo con cuenta)</h3>
              <p style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>
                Iniciá sesión para ver tus lecturas mejor puntuadas.
              </p>
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "1px solid var(--border)",
                    background: "var(--cream)",
                    color: "#1a1a1a",
                    fontWeight: 800,
                  }}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate("/register")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "1px solid var(--border)",
                    background: "rgba(255,255,255,0.06)",
                    color: "var(--text)",
                    fontWeight: 700,
                  }}
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function chipStyle(primary = false) {
  return {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: primary ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
    color: "var(--text)",
    fontSize: 12,
    fontWeight: 700,
  };
}
