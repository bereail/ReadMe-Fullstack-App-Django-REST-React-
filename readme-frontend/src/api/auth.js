// readme-frontend/src/api/auth.js
import { apiFetch } from "./api";

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
