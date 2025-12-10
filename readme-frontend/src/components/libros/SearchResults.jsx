import LibroCard from "./LibroCard";

export default function SearchResults({ resultados, onVer, onGuardar, puedeGuardar }) {
  if (!resultados || resultados.length === 0) {
    return <p>No se encontraron libros.</p>;
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {resultados.map((libro, index) => (
        <LibroCard
  key={index}
  data={libro}
  onVer={onVer}
  onGuardar={onGuardar}
  puedeGuardar={puedeGuardar}
/>

      ))}
    </div>
  );
}
