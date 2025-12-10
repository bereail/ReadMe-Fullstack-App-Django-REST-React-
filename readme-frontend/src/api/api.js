// ../api/api.js
const BASE_URL = "http://127.0.0.1:8000/api";

export async function apiGet(url, { auth = true } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${url}`, { headers });

  if (!res.ok) {
    console.error("Error API:", res.status, res.statusText);
    throw new Error(`Error API: ${res.status}`);
  }

  return res.json();
}
