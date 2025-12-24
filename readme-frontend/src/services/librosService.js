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
// Nota: NO pongas "/" antes del querystring
export function getLibrosClasicos({ page = 1, limit = 5 } = {}) {
  return apiFetch(
    `/openlibrary/subject/classics${qs({ page, limit })}`,
    { method: "GET" },
    { auth: false, timeoutMs: 8000, retries: 1 }
  );
}

export function getLibrosFantasy({ page = 1, limit = 5 } = {}) {
  return apiFetch(
    `/openlibrary/subject/fantasy${qs({ page, limit })}`,
    { method: "GET" },
    { auth: false, timeoutMs: 8000, retries: 1 }
  );
}

export function getLibrosScifi({ page = 1, limit = 5 } = {}) {
  return apiFetch(
    `/openlibrary/subject/science_fiction${qs({ page, limit })}`,
    { method: "GET" },
    { auth: false, timeoutMs: 8000, retries: 1 }
  );
}

// TOP (privado)
// 👉 Este endpoint NO está paginado en tu backend.
// Lo adaptamos a shape compatible con infinite.
export async function getLibrosMejorPuntuados({ page = 1, limit = 6 } = {}) {
  const data = await apiFetch(
    "/lecturas/top/",
    { method: "GET" },
    { auth: true, timeoutMs: 8000, retries: 1 }
  );

  const lecturas = normalizeLecturas(data);
  const libros = lecturas.map((l) => ({
    ...l.libro,
    rating: l.puntuacion ?? null,
  }));

  const start = (page - 1) * limit;
  const results = libros.slice(start, start + limit);
  const has_more = start + limit < libros.length;

  return { results, page, limit, has_more };
}
