import { apiFetch } from "./api";

export function getAnotacionesByLectura(id) {
  return apiFetch(`/anotaciones/?lectura=${id}`);
}

export function createAnotacion(payload) {
  return apiFetch(`/anotaciones/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}