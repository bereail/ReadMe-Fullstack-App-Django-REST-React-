import LibroCard from "./LibroCard";

export default function SearchResults({
  resultados,
  onVer,
  onGuardar,
  puedeGuardar,
}) {
  const items = Array.isArray(resultados) ? resultados : [];

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">
        No se encontraron libros.
      </div>
    );
  }

  return (
    <div
      className="
        grid gap-4
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
      "
    >
      {items.map((libro, index) => {
        const key =
          libro?.openlibrary_id ||
          libro?.key ||
          `${libro?.titulo || "t"}-${libro?.autor || "a"}-${libro?.anio || "y"}-${index}`;

        return (
          <LibroCard
            key={key}
            data={libro}
            onVer={onVer}
            onGuardar={onGuardar}
            puedeGuardar={puedeGuardar}
          />
        );
      })}
    </div>
  );
}
