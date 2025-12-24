import { useEffect, useRef } from "react";

export default function HorizontalCarousel({
  title,
  children,
  onEndReached,
  hasMore = true,
  loading = false,
  endOffsetPx = 220, // qué tan cerca del final dispara
}) {
  const trackRef = useRef(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !onEndReached) return;

    const handleScroll = () => {
      if (!hasMore || loading) return;
      if (cooldownRef.current) return;

      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - endOffsetPx;

      if (nearEnd) {
        cooldownRef.current = true;
        onEndReached();

        // cooldown para no spamear
        setTimeout(() => (cooldownRef.current = false), 500);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    // 🔥 caso: pocos items, no hay scroll, pero igual queremos intentar cargar más
    // (solo una vez al montar/cambiar children)
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [onEndReached, hasMore, loading, endOffsetPx, children]);

  return (
    <section className="section">
      {title ? (
        <div className="sectionHeader">
          <h3 className="sectionTitle">{title}</h3>
        </div>
      ) : null}

      <div ref={trackRef} className="hlist">
        {children}
      </div>
    </section>
  );
}
