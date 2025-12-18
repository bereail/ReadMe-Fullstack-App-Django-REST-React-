import { useEffect, useRef } from "react";

export default function HorizontalCarousel({
  title,
  children,
  onEndReached,
  hasMore = true,
  loading = false,
}) {
  const trackRef = useRef(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !onEndReached) return;

    const handleScroll = () => {
      if (!hasMore || loading) return;
      if (cooldownRef.current) return;

      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 200;

      if (nearEnd) {
        cooldownRef.current = true;
        onEndReached();

        // cooldown de 400ms para no spamear requests
        setTimeout(() => (cooldownRef.current = false), 400);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [onEndReached, hasMore, loading]);

  return (
    <section style={{ margin: "24px 0" }}>
      <h2 style={{ marginBottom: 10 }}>{title}</h2>

      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 8,
          scrollSnapType: "x mandatory",
        }}
      >
        {children}
      </div>
    </section>
  );
}
