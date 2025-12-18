export function normalizeLibro(item) {
  const coverId = item.cover_i || item.cover_id || null;

  return {
    titulo: item.titulo ?? item.title ?? "Sin título",
    autor: item.autor ?? (item.author_name?.[0] ?? "Desconocido"),
    anio: item.anio ?? item.first_publish_year ?? null,
    portada: coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : null,
    descripcion: item.descripcion ?? item.description ?? null,
  };
}

export function normalizeLibros(list) {
  return Array.isArray(list) ? list.map(normalizeLibro) : [];
}
