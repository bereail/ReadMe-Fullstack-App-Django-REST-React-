import { apiFetch } from "./api";

export async function buscarLibrosPorNombre(nombre) {
  return apiFetch(
    `/buscar-libros/?q=${encodeURIComponent(nombre)}`,
    {},
    { auth: false } // si tu endpoint es público (AllowAny)
  );
}
