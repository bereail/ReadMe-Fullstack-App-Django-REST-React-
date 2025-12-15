// src/api/api.js

// 🔹 Base URL dinámica según entorno
// En Netlify: viene de REACT_APP_API_URL
// En local: cae al localhost
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// -------------------------------------
// Headers con JWT
// -------------------------------------
function getAuthHeaders() {
  const token = localStorage.getItem("accessToken"); // 🔥 un solo nombre, consistente

  const headers = {
    "Content-Type": "application/json",
  };

  if (token && token !== "null" && token !== "undefined") {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// -------------------------------------
// Fetch genérico
// -------------------------------------
export async function apiFetch(
  url,
  options = {},
  { auth = true } = {}
) {
  const headers = auth
    ? getAuthHeaders()
    : { "Content-Type": "application/json" };

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Manejo de errores
  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch (e) {
      // no-op
    }

    console.error("API ERROR:", res.status, errorData);

    throw new Error(
      errorData.detail ||
      errorData.error ||
      `Error API ${res.status}`
    );
  }

  // Si no hay body (204, etc.)
  if (res.status === 204) return null;

  return res.json();
}
