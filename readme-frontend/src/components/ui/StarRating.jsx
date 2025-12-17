// src/components/StarRating.jsx
export default function StarRating({ value = 0, max = 5, size = 16 }) {
  const n = Math.max(0, Math.min(max, Number(value) || 0));

  return (
    <div style={{ display: "flex", gap: 2, lineHeight: 1 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i < n ? "#f5b301" : "#cfcfcf", // amarillo / gris
          }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}
