export default function LibroCard({ data, onVer, onGuardar, puedeGuardar }) {
  const portada = data?.portada || data?.cover_url;

  return (
    <div
      style={{
        width: "clamp(160px, 20vw, 220px)", // ✅ 3-5 cards según pantalla
        flexShrink: 0,
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
        scrollSnapAlign: "start", // ✅ para “snap” al scrollear
      }}
    >
      <div
        style={{
          width: "100%",
          height: 240,
          marginBottom: 8,
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {portada ? (
         <img
  src={portada}
  alt={data?.titulo || "Libro"}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
  loading="lazy"
  decoding="async"
/>

        ) : (
          <span>Sin portada</span>
        )}
      </div>

      <strong style={{ fontSize: 14 }}>{data?.titulo}</strong>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{data?.autor}</div>

      {data?.anio && (
        <div style={{ fontSize: 12, opacity: 0.6 }}>Año: {data.anio}</div>
      )}

      <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
        <button onClick={() => onVer(data)}>Ver</button>
        {puedeGuardar && <button onClick={() => onGuardar(data)}>Guardar</button>}
      </div>
    </div>
  );
}
