export default function LibroMiniCard({ libro }) {
  const portada = libro?.portada;

  return (
    <div style={{ display: "flex", gap: 14 }}>
      {portada ? (
        <img
          src={portada}
          alt={libro?.titulo || "Libro"}
          style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 6 }}
        />
      ) : (
        <div style={{ width: 60, height: 90, background: "#eee", borderRadius: 6 }} />
      )}

      <div>
        <strong>{libro?.titulo || "Sin título"}</strong> — {libro?.autor || "Desconocido"}
      </div>
    </div>
  );
}
