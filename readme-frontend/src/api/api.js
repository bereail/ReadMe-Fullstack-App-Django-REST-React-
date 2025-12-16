// src/api/api.js

// 🔹 Base URL dinámica según entorno
// En Netlify: viene de REACT_APP_API_URL
// En local: cae al localhost
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// 🔍 DEBUG TEMPORAL (AGREGAR ACÁ)
console.log("ENV REACT_APP_API_URL =", process.env.REACT_APP_API_URL);
console.log("BASE_URL =", BASE_URL);

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
