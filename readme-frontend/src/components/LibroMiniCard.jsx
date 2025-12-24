export default function LibroMiniCard({ libro }) {
  const portada =
    libro?.portada ||
    libro?.cover_url ||
    libro?.cover ||
    null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-black/10 bg-white/60 p-3 transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
      {/* Portada */}
      <div className="h-[90px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
        {portada ? (
          <img
            src={portada}
            alt={libro?.titulo || "Libro"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400 dark:text-ink-muted">
            Sin portada
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="m-0 truncate text-sm font-bold text-ink dark:text-ink-dark">
          {libro?.titulo || "Sin título"}
        </p>

        <p className="m-0 truncate text-xs text-neutral-600 dark:text-ink-muted">
          {libro?.autor || "Desconocido"}
        </p>
      </div>
    </div>
  );
}
