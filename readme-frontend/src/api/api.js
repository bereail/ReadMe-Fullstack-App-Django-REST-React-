// api.js

const API_ORIGIN =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

const BASE_URL = `${API_ORIGIN}/api`;

// Errores temporales donde conviene reintentar
const RETRY_STATUSES = new Set([502, 503, 504]);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function apiFetch(
  url,
  options = {},
  { auth = true, timeoutMs = 12000, retries = 2 } = {}
) {
  const token = localStorage.getItem("accessToken");

  // ✅ fusiona headers que vengan en options
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ✅ timeout con AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    // ✅ lee body como texto primero
    const raw = await res.text();

    // ✅ si fallo y es reintentable
    if (!res.ok && RETRY_STATUSES.has(res.status) && retries > 0) {
      // backoff simple
      await sleep(600 * (3 - retries)); // 600ms, 1200ms...
      return apiFetch(url, options, { auth, timeoutMs, retries: retries - 1 });
    }

    if (!res.ok) {
      let detail = `Error ${res.status}`;
      try {
        const json = raw ? JSON.parse(raw) : {};
        detail = json.detail || json.error || detail;
      } catch {
        if (raw) detail = `${detail}: ${raw.slice(0, 200)}`;
      }
      throw new Error(detail);
    }

    if (res.status === 204) return null;
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (err) {
  if (err?.name === "AbortError") {
    throw new Error("Tiempo de espera agotado. Reintentá.");
  }
  throw err;
}
 finally {
    clearTimeout(timeoutId);
  }
}

export function apiGet(url, { auth = true, timeoutMs, retries } = {}) {
  return apiFetch(url, { method: "GET" }, { auth, timeoutMs, retries });
}

export function apiPost(url, body, { auth = true, timeoutMs, retries } = {}) {
  return apiFetch(
    url,
    { method: "POST", body: JSON.stringify(body) },
    { auth, timeoutMs, retries }
  );
}

export function apiPut(url, body, { auth = true, timeoutMs, retries } = {}) {
  return apiFetch(
    url,
    { method: "PUT", body: JSON.stringify(body) },
    { auth, timeoutMs, retries }
  );
}

export function apiPatch(url, body, { auth = true, timeoutMs, retries } = {}) {
  return apiFetch(
    url,
    { method: "PATCH", body: JSON.stringify(body) },
    { auth, timeoutMs, retries }
  );
}

export function apiDelete(url, { auth = true, timeoutMs, retries } = {}) {
  return apiFetch(url, { method: "DELETE" }, { auth, timeoutMs, retries });
}
