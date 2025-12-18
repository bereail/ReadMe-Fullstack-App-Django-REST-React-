const API_ORIGIN =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

const BASE_URL = `${API_ORIGIN}/api`;

export async function apiFetch(url, options = {}, { auth = true } = {}) {
  const token = localStorage.getItem("accessToken");

  // ✅ fusiona headers que vengan en options
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // ✅ lee el body como texto primero (así no explota si no es JSON)
  const raw = await res.text();

  if (!res.ok) {
    let detail = `Error ${res.status}`;
    try {
      const json = raw ? JSON.parse(raw) : {};
      detail = json.detail || json.error || detail;
    } catch {
      // si no es JSON, dejamos texto recortado para debug
      if (raw) detail = `${detail}: ${raw.slice(0, 200)}`;
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null;

  // ✅ si viene vacío, null
  if (!raw) return null;

  // ✅ parsea json cuando corresponde
  try {
    return JSON.parse(raw);
  } catch {
    // fallback: devolver texto (raro, pero mejor que romper)
    return raw;
  }
}

export function apiGet(url, { auth = true } = {}) {
  return apiFetch(url, { method: "GET" }, { auth });
}

export function apiPost(url, body, { auth = true } = {}) {
  return apiFetch(
    url,
    { method: "POST", body: JSON.stringify(body) },
    { auth }
  );
}

export function apiPut(url, body, { auth = true } = {}) {
  return apiFetch(
    url,
    { method: "PUT", body: JSON.stringify(body) },
    { auth }
  );
}

export function apiPatch(url, body, { auth = true } = {}) {
  return apiFetch(
    url,
    { method: "PATCH", body: JSON.stringify(body) },
    { auth }
  );
}

export function apiDelete(url, { auth = true } = {}) {
  return apiFetch(url, { method: "DELETE" }, { auth });
}
