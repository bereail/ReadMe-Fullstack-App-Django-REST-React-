export function normalizeLectura(raw) {
  const libroRaw = raw.libro ?? {};

  return {
    id: raw.id,
    fecha_inicio: raw.fecha_inicio ?? null,
    fecha_fin: raw.fecha_fin ?? null,
    puntuacion: raw.puntuacion ?? 0,
    comentario: raw.comentario ?? "",
    lugar_finalizacion: raw.lugar_finalizacion ?? "",
    libro: {
      titulo: libroRaw.titulo ?? "Sin título",
      autor: libroRaw.autor ?? "Desconocido",
      portada: libroRaw.portada ?? null,
      anio: libroRaw.anio ?? null,
      descripcion: libroRaw.descripcion ?? null,
    },
  };
}

export function normalizeLecturas(list) {
  return Array.isArray(list) ? list.map(normalizeLectura) : [];
}
