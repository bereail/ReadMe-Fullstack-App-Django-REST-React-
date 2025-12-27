import { apiFetch, apiGet } from "./api";
import { normalizeLibros } from "../adapters/librosAdapter";

// Busca en OpenLibrary (proxy en Django)
export async function buscarLibrosPorNombre(q) {
  return apiFetch(`/openlibrary/buscar/?q=${encodeURIComponent(q)}`, { auth: false });
}

export async function buscarLibrosPorSubject(subjectKey, { page = 1, limit = 8 } = {}) {
  const data = await apiGet(
    `/openlibrary/subject/${encodeURIComponent(subjectKey)}/?page=${page}&limit=${limit}`,
    { auth: false }
  );

  // tu backend devuelve { results: [...] }
  const results = Array.isArray(data?.results) ? data.results : [];
  return normalizeLibros(results);
}