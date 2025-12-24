export default function LibroCard({ data, onVer, onGuardar, puedeGuardar }) {
  const portada = data?.portada || data?.cover_url;

  return (
    <article
      className="
        w-[clamp(160px,20vw,220px)]
        shrink-0
        scroll-snap-start
        rounded-xl
        border border-black/10
        bg-white
        p-3
        transition
        hover:shadow-md
        dark:border-white/10
        dark:bg-neutral-900
      "
    >
      {/* Portada */}
      <div className="mb-2 h-60 w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        {portada ? (
          <img
            src={portada}
            alt={data?.titulo || "Libro"}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
            Sin portada
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-0.5">
        <h3
          className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 dark:text-neutral-100"
          title={data?.titulo}
        >
          {data?.titulo || "Sin título"}
        </h3>

        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          {data?.autor || "Autor desconocido"}
        </p>

        {data?.anio && (
          <p className="text-[11px] text-neutral-500 dark:text-neutral-500">
            Año: {data.anio}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onVer(data)}
          className="
            flex-1
            rounded-lg
            border border-black/10
            bg-white
            px-2 py-1.5
            text-xs font-semibold
            transition
            hover:bg-neutral-50
            active:scale-[0.98]
            dark:border-white/10
            dark:bg-neutral-950
            dark:hover:bg-neutral-800
          "
        >
          Ver
        </button>

        {puedeGuardar && (
          <button
            onClick={() => onGuardar(data)}
            className="
              flex-1
              rounded-lg
              bg-black
              px-2 py-1.5
              text-xs font-bold
              text-white
              transition
              hover:bg-black/90
              active:scale-[0.98]
            "
          >
            Guardar
          </button>
        )}
      </div>
    </article>
  );
}
