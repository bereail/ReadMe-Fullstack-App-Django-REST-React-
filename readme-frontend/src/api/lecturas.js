// src/api/lecturas.js
import { apiFetch } from "./api";


/*-------------------------- GUARDAR LECTURA -------------------------*/
export async function guardarLecturaApi(payload) {
  return apiFetch(
    "/guardar-libro/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { auth: true }
  );
}

/*-------------------------- OBTENER MIS LECTURAS-------------------------*/
export async function obtenerMisLecturas() {
  return apiFetch("/mis-lecturas/", {}, { auth: true });
}