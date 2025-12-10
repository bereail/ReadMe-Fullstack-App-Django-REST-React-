// src/api/lecturas.js
const BASE_URL = "http://localhost:8000/api";

export async function guardarLecturaApi(libro, extraData = {}) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No hay token, usuario no autenticado");
  }

  const payload = {
    titulo: libro.titulo,
    autor: libro.autor,
    anio: libro.anio,
    cover_url: libro.cover_url || null,
    openlibrary_id: libro.openlibrary_id || null, // <-- AHORA SÍ EXISTE

    fecha_inicio: extraData.fecha_inicio || null,
    fecha_fin: extraData.fecha_fin || null,
    lugar: extraData.lugar || "",
    puntaje: extraData.puntaje || null,
    comentario: extraData.comentario || "",
  };

  const response = await fetch(`${BASE_URL}/guardar-libro/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Error en guardarLecturaApi:", errorData);
    throw new Error("Error al guardar la lectura");
  }

  return response.json();
}
