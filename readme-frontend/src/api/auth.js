// readme-frontend/src/api/auth.js
import { apiFetch } from "./api";

export async function registerRequest(username, password) {
  const r = await fetch("http://localhost:8000/api/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await r.json();
  if (!r.ok) throw new Error(data?.detail || "No se pudo registrar");
  return data;
}

export async function loginRequest(username, password) {
  // OJO: NO /api acá. apiFetch ya usa BASE_URL = .../api
  return apiFetch(
    "/auth/login/",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    },
    { auth: false } // login NO lleva JWT
  );
}
