import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/libros/SearchBar";
import SearchResults from "../components/libros/SearchResults";
import { buscarLibrosPorNombre } from "../api/libros";
import { guardarLecturaApi } from "../api/lecturas";
import { normalizeLibros, normalizeLibro } from "../adapters/librosAdapter"; // ✅

export default function LibrosPage() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  async function manejarBusqueda() {
    if (query.trim() === "") return;

    setLoading(true);
    try {
      const data = await buscarLibrosPorNombre(query);
      setResultados(normalizeLibros(data)); // ✅ normalizás acá
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function manejarVer(libro) {
    // ✅ libro ya viene normalizado
    navigate("/libro", { state: { libro } });
  }

  async function manejarGuardar(libro) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      // ✅ por si acaso, re-normalizamos (no cuesta nada y evita bugs)
      const libroNormalizado = normalizeLibro(libro);

      await guardarLecturaApi(libroNormalizado, {
        // más adelante: fecha_inicio, puntuacion, comentario, etc.
      });

      navigate("/mis-lecturas");
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la lectura.");
    }
  }

  return (
    <div>
      <h1>Buscar Libros</h1>

      <SearchBar value={query} onChange={setQuery} onSubmit={manejarBusqueda} />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <SearchResults
          resultados={resultados} // ✅ ya normalizados
          onVer={manejarVer}
          onGuardar={manejarGuardar}
          puedeGuardar={isAuthenticated}
        />
      )}
    </div>
  );
}
