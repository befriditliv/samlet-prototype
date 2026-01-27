import { useEffect, useRef, useState } from "react";

type UseInViewOnceOptions = IntersectionObserverInit;

export function useInViewOnce<T extends Element>(options: UseInViewOnceOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  const { root = null, rootMargin = "0px 0px -10% 0px", threshold = 0.15 } = options;

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [inView, root, rootMargin, threshold]);

  return { ref, inView };
}
