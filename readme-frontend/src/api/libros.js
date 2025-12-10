const BASE_URL = "http://localhost:8000/api";

export async function buscarLibrosPorNombre(nombre) {
  const response = await fetch(`${BASE_URL}/buscar-libros/?q=${nombre}`);
  if (!response.ok) throw new Error("Error buscando libros");
  return response.json();
}
