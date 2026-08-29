import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Mark da Ubatuba Stay — a linha ondulada do masthead do design system,
 * mais o ponto coral (sol/maré). Reaproveitada aqui como componente único
 * para não duplicar o SVG entre nav, hero e footer.
 *
 * `animateOnMount` desenha a linha com stroke-dasharray/dashoffset (o
 * "SVG line animation" pedido no briefing), respeitando reduced-motion.
 */
export function Logo({ inverse = true, animateOnMount = false, className = '' }) {
  const pathRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !animateOnMount || reducedMotion) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    // Força reflow antes de animar a transição.
    path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 1400ms var(--ease, ease) 200ms';
    path.style.strokeDashoffset = '0';
  }, [animateOnMount, reducedMotion]);

  const lineColor = inverse ? 'rgba(247,243,236,0.9)' : 'var(--ub-costa)';

  return (
    <svg
      width="42"
      height="26"
      viewBox="0 0 42 26"
      aria-hidden="true"
      className={className}
    >
      <path
        ref={pathRef}
        d="M4 6 C4 20, 20 22, 24 13 C27 6, 36 6, 37 12 C38 18, 30 21, 27 16"
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="6" r="5.5" fill="var(--ub-mare)" />
    </svg>
  );
}
