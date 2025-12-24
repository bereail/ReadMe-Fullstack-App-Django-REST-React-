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
    <section className="mt-10">
      {/* Título */}
      <h2 className="mb-3 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
          Cargando…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Resultados */}
      {!loading && !error && items?.length > 0 && (
        <SearchResults
          resultados={items}
          onVer={onVer}
          onGuardar={onGuardar}
          puedeGuardar={puedeGuardar}
        />
      )}

      {/* Empty state */}
      {!loading && !error && items?.length === 0 && (
        <div className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-6 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">
          No hay libros para mostrar en esta sección.
        </div>
      )}
    </section>
  );
}
