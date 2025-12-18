import { useEffect, useState } from "react";

export function useLibrosList(fetcher, deps = []) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError("");

      try {
        const data = await fetcher();
        if (alive) setItems(data);
      } catch (e) {
        console.error(e);
        if (alive) setError("No se pudo cargar");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { items, loading, error };
}
