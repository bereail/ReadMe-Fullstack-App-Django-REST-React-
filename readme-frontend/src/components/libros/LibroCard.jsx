export default function LibroCard({ data, onVer, onGuardar, puedeGuardar }) {
  const portada = data?.portada || data?.cover_url;

  return (
    <article className="card">
      {/* Portada */}
      <div className="cover">
        {portada ? (
          <img
  src={portada}
  alt={data?.titulo || "Libro"}
  loading="lazy"
  decoding="async"
  onError={(e) => {
    e.currentTarget.src = "/no-cover.png";
  }}
/>

        ) : (
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Sin portada</div>
        )}
      </div>

      {/* Info */}
      <div className="meta">
        <h4 title={data?.titulo}>{data?.titulo || "Sin título"}</h4>
        <p>{data?.autor || "Autor desconocido"}</p>
        {data?.anio ? <p style={{ marginTop: 6 }}>Año: {data.anio}</p> : null}

        {/* Acciones */}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button
            type="button"
            onClick={() => onVer(data)}
            style={btnGhost()}
          >
            Ver
          </button>

          {puedeGuardar && (
            <button
              type="button"
              onClick={() => onGuardar(data)}
              style={btnPrimary()}
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function btnGhost() {
  return {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "rgba(255,255,255,0.04)",
    color: "var(--text)",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function btnPrimary() {
  return {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--cream)",
    color: "#1a1a1a",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  };
}
