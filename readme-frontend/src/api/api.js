const API_ORIGIN =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

const BASE_URL = `${API_ORIGIN}/api`;

export async function apiFetch(url, options = {}, { auth = true } = {}) {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
  };

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}


