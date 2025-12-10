import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/libros/SearchBar";
import SearchResults from "../components/libros/SearchResults";
import { buscarLibrosPorNombre } from "../api/libros";
import { guardarLecturaApi } from "../api/lecturas"; // 👈 IMPORTANTE

// import { useAuth } from "../context/AuthContext"; // si más adelante usás contexto

export default function LibrosPage() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // const { isAuthenticated } = useAuth(); // cuando armes contexto
  const isAuthenticated = !!localStorage.getItem("accessToken"); // por ahora simple

  async function manejarBusqueda() {
    if (query.trim() === "") return;

    setLoading(true);
    try {
      const data = await buscarLibrosPorNombre(query);
      setResultados(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function manejarVer(libro) {
    // Navega a la página de detalle, enviando el libro en el estado
    navigate("/libro", { state: { libro } });
  }

  async function manejarGuardar(libro) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await guardarLecturaApi(libro, {
        // si querés después agregamos fechas/comentario acá también
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

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={manejarBusqueda}
      />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <SearchResults
          resultados={resultados}
          onVer={manejarVer}
          onGuardar={manejarGuardar}
          puedeGuardar={isAuthenticated}
        />
      )}
    </div>
  );
}
