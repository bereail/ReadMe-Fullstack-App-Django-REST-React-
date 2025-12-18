import { apiFetch } from "../api/api";
import { normalizeLecturas } from "../adapters/lecturasAdapter";

// helper para armar querystring
function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// SUBJECTS (públicos, paginados)
export function getLibrosClasicos({ page = 1, limit = 5 } = {}) {
  return apiFetch(
    `/openlibrary/subject/classics/${qs({ page, limit })}`,
    {},
    { auth: false }
  );
}

export function getLibrosFantasy({ page = 1, limit = 5 } = {}) {
  return apiFetch(
    `/openlibrary/subject/fantasy/${qs({ page, limit })}`,
    {},
    { auth: false }
  );
}

export function getLibrosScifi({ page = 1, limit = 5 } = {}) {
  return apiFetch(
    `/openlibrary/subject/science_fiction/${qs({ page, limit })}`,
    {},
    { auth: false }
  );
}

// TOP (privado)
// 👉 IMPORTANTE: este endpoint NO está paginado en tu backend.
// Para usarlo con infinite, lo devolvemos con shape compatible.
export async function getLibrosMejorPuntuados({ page = 1, limit = 6 } = {}) {
  // Si querés paginarlo real, hay que tocar backend.
  // Por ahora: lo traemos 1 vez y cortamos en front.
  const data = await apiFetch("/lecturas/top/", {}, { auth: true });

  const lecturas = normalizeLecturas(data);
  const libros = lecturas.map((l) => ({
    ...l.libro,
    rating: l.puntuacion ?? null,
  }));

  // simular paginado
  const start = (page - 1) * limit;
  const results = libros.slice(start, start + limit);
  const has_more = start + limit < libros.length;

  return { results, page, limit, has_more };
}
