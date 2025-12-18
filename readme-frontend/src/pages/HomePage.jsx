import HorizontalCarousel from "../components/ui/HorizontalCarousel";
import LibroCard from "../components/libros/LibroCard";
import { useInfiniteList } from "../hooks/useInfiniteHorizontalList";
import {
  getLibrosClasicos,
  getLibrosFantasy,
  getLibrosScifi,
  getLibrosMejorPuntuados,
} from "../services/librosService";
import { useNavigate } from "react-router-dom";
import { guardarLecturaApi } from "../api/lecturas";

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // ✅ PÚBLICO (sin login)
  const clasicos = useInfiniteList(getLibrosClasicos, [], { limit: 5 });
  const fantasy  = useInfiniteList(getLibrosFantasy, [], { limit: 5 });
  const scifi    = useInfiniteList(getLibrosScifi, [], { limit: 5 });

  // ✅ PRIVADO (solo si hay login)
  const top = useInfiniteList(
    (params) =>
      isAuthenticated
        ? getLibrosMejorPuntuados(params)
        : Promise.resolve({ results: [], has_more: false }),
    [isAuthenticated],
    { limit: 6 }
  );

  const onVer = (libro) => navigate("/libro", { state: { libro } });

  const onGuardar = async (libro) => {
    if (!isAuthenticated) return navigate("/login");
    await guardarLecturaApi(libro);
    navigate("/mis-lecturas");
  };

  const renderSection = (title, state, puedeGuardar = isAuthenticated) => (
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

      {state.loading && <p style={{ padding: 8 }}>Cargando...</p>}
      {state.error && <p style={{ padding: 8, color: "red" }}>{state.error}</p>}
      {!state.loading && !state.hasMore && state.items.length > 0 && (
        <p style={{ padding: 8, opacity: 0.7 }}>No hay más.</p>
      )}
    </HorizontalCarousel>
  );

  return (
    <div>
      <h1>ReadMe</h1>

      {renderSection("Clásicos", clasicos, false)}
      {renderSection("Fantasía", fantasy, false)}
      {renderSection("Sci-Fi", scifi, false)}

      {/* ✅ SOLO LOGUEADO */}
      {isAuthenticated ? (
        renderSection("Mejor puntuados", top, true)
      ) : (
        <p style={{ opacity: 0.7 }}>
          Iniciá sesión para ver tus lecturas mejor puntuadas.
        </p>
      )}
    </div>
  );
}
