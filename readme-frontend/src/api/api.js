

const API_ORIGIN = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_ORIGIN}/api`;

// 🔍 DEBUG TEMPORAL (AGREGAR ACÁ)
console.log("ENV REACT_APP_API_URL =", process.env.REACT_APP_API_URL);
console.log("BASE_URL =", BASE_URL);
// readme-frontend/src/api/api.js

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  const headers = { "Content-Type": "application/json" };
  if (token && token !== "null" && token !== "undefined") {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch(url, options = {}, { auth = true } = {}) {
  const headers = auth
    ? getAuthHeaders()
    : { "Content-Type": "application/json" };

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch (_) {}

    console.error("API ERROR:", res.status, errorData);
    throw new Error(errorData.detail || errorData.error || `Error API ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}
