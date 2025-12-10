const BASE_URL = "http://localhost:8000"; // ajustá si usás otro puerto/host

export async function loginRequest(username, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    // 401, 400, etc
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.detail || "Credenciales inválidas o error en el servidor.";
    throw new Error(message);
  }

  return response.json(); // { access, refresh }
}
