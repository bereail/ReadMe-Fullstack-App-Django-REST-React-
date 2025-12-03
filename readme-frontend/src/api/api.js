const BASE_URL = "http://127.0.0.1:8000/api";

export async function apiGet(url, token) {
  const res = await fetch(BASE_URL + url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
