import { useEffect, useRef } from 'react';

/**
 * Reveal simples baseado em IntersectionObserver + a classe .reveal do
 * index.css (opacity + translateY discreto). Usado nas seções que não
 * precisam do controle fino do GSAP ScrollTrigger — mantém o JS mínimo
 * para microinterações que o CSS já resolve bem.
 *
 * Uso: const ref = useScrollReveal(); <div ref={ref} className="reveal">…</div>
 */
export function useScrollReveal({ threshold = 0.18, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
