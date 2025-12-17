// src/api/lecturas.js
import { apiFetch } from "./api";

/*-------------------------- GUARDAR LECTURA -------------------------*/
export function guardarLecturaApi(payload) {
  return apiFetch(
    "/guardar-libro/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/*-------------------------- LECTURAS (CRUD) -------------------------*/
export function getMisLecturas() {
  return apiFetch("/lecturas/");
}

export function getLectura(id) {
  return apiFetch(`/lecturas/${id}/`);
}

export function updateLectura(id, payload) {
  return apiFetch(`/lecturas/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteLectura(id) {
  return apiFetch(`/lecturas/${id}/`, {
    method: "DELETE",
  });
}


/*-------------------- ANOTACIONES ---------------*/
export function getAnotacionesByLectura(id) {
  return apiFetch(`/lecturas/${id}/anotaciones/`);
}