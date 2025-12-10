export default function LibroCard({ data, onVer, onGuardar, puedeGuardar }) {
  const { titulo, autor, anio, cover_url } = data;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        display: "flex",
        gap: "12px",
        background: "white",
      }}
    >
      {/* Portada */}
      {cover_url ? (
        <img
          src={cover_url}
          alt={titulo}
          style={{ width: "70px", height: "100px", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "70px",
            height: "100px",
            background: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Sin portada
        </div>
      )}

      {/* Info + botones */}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: "0 0 4px" }}>{titulo}</h3>
        <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#555" }}>
          {autor || "Autor desconocido"}
        </p>
        {anio && (
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#777" }}>
            Año: {anio}
          </p>
        )}

        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button
            onClick={() => onVer && onVer(data)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #222",
              background: "white",
              cursor: "pointer",
            }}
          >
            Ver
          </button>

          {puedeGuardar && (
            <button
              onClick={() => onGuardar && onGuardar(data)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "none",
                background: "#222",
                color: "white",
                cursor: "pointer",
              }}
            >
              Guardar lectura
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
