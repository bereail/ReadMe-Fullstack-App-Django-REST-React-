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

  // cancelar requests al cambiar deps / resetear
  const abortRef = useRef(null);

  // id incremental para ignorar respuestas viejas
  const reqIdRef = useRef(0);

  const cancelOngoing = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cancelOngoing();

    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    setError("");

    pageRef.current = 1;
    loadingRef.current = false;
    hasMoreRef.current = true;
  }, [cancelOngoing]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    if (!hasMoreRef.current) return;

    // cancelá una anterior (por si quedó colgada)
    cancelOngoing();

    const controller = new AbortController();
    abortRef.current = controller;

    const myReqId = ++reqIdRef.current;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const currentPage = pageRef.current;

      // 👇 IMPORTANTE: pasamos signal para poder abortar
      const data = await fetchPage({
        page: currentPage,
        limit,
        signal: controller.signal,
      });

      // si llegó una respuesta vieja, la ignoramos
      if (myReqId !== reqIdRef.current) return;

      const results = Array.isArray(data?.results) ? data.results : [];
      const nextHasMore = !!data?.has_more;

      setItems((prev) => {
        const seen = new Set(prev.map((x) => `${x.titulo}__${x.autor}`));
        const filtered = results.filter(
          (x) => !seen.has(`${x.titulo}__${x.autor}`)
        );
        return [...prev, ...filtered];
      });

      setHasMore(nextHasMore);
      hasMoreRef.current = nextHasMore;

      const nextPage = currentPage + 1;
      setPage(nextPage);
      pageRef.current = nextPage;
    } catch (e) {
      // AbortError no es “fallo real”: pasó por reset/cambio de deps/timeout
      if (e?.name === "AbortError") return;

      console.error(e);
      setError(e?.message || "No se pudo cargar más");
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      // si es una respuesta vieja, no toques estado
      if (myReqId !== reqIdRef.current) return;

      loadingRef.current = false;
      setLoading(false);
      abortRef.current = null;
    }
  }, [fetchPage, limit, cancelOngoing]);

  useEffect(() => {
    reset();
    loadMore();

    // cleanup al desmontar o cambiar deps
    return () => {
      cancelOngoing();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { items, loadMore, loading, hasMore, error, reset, page };
}
