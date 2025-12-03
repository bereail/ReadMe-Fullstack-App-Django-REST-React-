import { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function Populares() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    async function cargar() {
      const data = await apiGet("/libros-populares/");
      setLibros(Array.isArray(data) ? data : []);
    }

    cargar();
  }, []);

  return (
    <div>
      <h1>Libros Populares</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {libros.map((libro, i) => (
          <div key={i} style={{ width: "150px" }}>
            {libro.cover_url && (
              <img src={libro.cover_url} alt={libro.titulo} width="150" />
            )}
            <h3>{libro.titulo}</h3>
            <p>{libro.autor}</p>
            <small>{libro.anio}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
