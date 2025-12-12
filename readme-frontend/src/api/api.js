// src/api/api.js
const BASE_URL = "http://127.0.0.1:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken"); // 🔥 UN SOLO NOMBRE

  const headers = {
    "Content-Type": "application/json",
  };

  if (token && token !== "null" && token !== "undefined") {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiFetch(url, options = {}, { auth = true } = {}) {
  const headers = auth ? getAuthHeaders() : { "Content-Type": "application/json" };

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("API ERROR:", res.status, errorData);
    throw new Error(errorData.detail || `Error API ${res.status}`);
  }

  return res.json();
}
