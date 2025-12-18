import SearchResults from "./SearchResults";
import { useLibrosList } from "../../hooks/useLibrosList";

export default function BookSection({
  title,
  fetcher,
  deps = [],
  onVer,
  onGuardar,
  puedeGuardar,
}) {
  const { items, loading, error } = useLibrosList(fetcher, deps);

  return (
    <section style={{ marginTop: 24 }}>
      <h2>{title}</h2>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <SearchResults
          resultados={items}
          onVer={onVer}
          onGuardar={onGuardar}
          puedeGuardar={puedeGuardar}
        />
      )}
    </section>
  );
}
