import { useCallback, useEffect, useRef, useState } from "react";

export function useInfiniteList(fetchPage, deps = [], { limit = 5 } = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // refs para evitar race conditions
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    setError("");
    pageRef.current = 1;
    loadingRef.current = false;
    hasMoreRef.current = true;
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    if (!hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const currentPage = pageRef.current;
      const data = await fetchPage({ page: currentPage, limit });

      const results = Array.isArray(data?.results) ? data.results : [];
      const nextHasMore = !!data?.has_more;

      setItems((prev) => {
        // opcional: evitar duplicados por titulo+autor
        const seen = new Set(prev.map((x) => `${x.titulo}__${x.autor}`));
        const filtered = results.filter((x) => !seen.has(`${x.titulo}__${x.autor}`));
        return [...prev, ...filtered];
      });

      setHasMore(nextHasMore);
      hasMoreRef.current = nextHasMore;

      const nextPage = currentPage + 1;
      setPage(nextPage);
      pageRef.current = nextPage;
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar más");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [fetchPage, limit]);

  // primera carga y cuando cambian deps
  useEffect(() => {
    reset();
    // cargamos primera página
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { items, loadMore, loading, hasMore, error, reset, page };
}
