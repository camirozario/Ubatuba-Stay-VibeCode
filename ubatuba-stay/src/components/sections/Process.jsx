import { useEffect, useRef, useState } from 'react';
import { processSteps } from '../../data/process';
import { processImage } from '../../data/images';
import { Eyebrow } from '../ui/Eyebrow';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Section } from '../layout/Section';
import { cn } from '../../utils/cn';

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const SNAP_DURATION_MS = 820;
const SNAP_COOLDOWN_MS = 140;
const WHEEL_DELTA_THRESHOLD = 2;
const WHEEL_GESTURE_THRESHOLD = 18;
const WHEEL_GESTURE_RESET_MS = 160;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function cubicBezierPoint(t, a1, a2) {
  const c = 3 * a1;
  const b = 3 * (a2 - a1) - c;
  const a = 1 - c - b;
  return ((a * t + b) * t + c) * t;
}

function cubicBezierSlope(t, a1, a2) {
  const c = 3 * a1;
  const b = 3 * (a2 - a1) - c;
  const a = 1 - c - b;
  return (3 * a * t + 2 * b) * t + c;
}

function createBezierEasing(x1, y1, x2, y2) {
  return (value) => {
    let estimate = value;

    for (let index = 0; index < 7; index += 1) {
      const slope = cubicBezierSlope(estimate, x1, x2);
      if (Math.abs(slope) < 0.001) break;
      estimate -= (cubicBezierPoint(estimate, x1, x2) - value) / slope;
    }

    return cubicBezierPoint(clamp(estimate, 0, 1), y1, y2);
  };
}

const EDITORIAL_EASE = createBezierEasing(0.76, 0, 0.24, 1);

/**
 * 05 — Como funciona.
 * Sticky scroll storytelling: a coluna da esquerda (título + fotografia)
 * fica fixa em telas grandes enquanto as sete etapas avançam à direita.
 * A etapa ativa é detectada com IntersectionObserver (uma faixa fina no
 * centro da viewport) em vez de recalcular posições a cada scroll — mais
 * barato e sem depender de pin do GSAP para algo que CSS sticky já resolve.
 * Em mobile a coluna deixa de ser sticky: vira uma lista simples empilhada.
 */
export function Process() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const processRef = useRef(null);
  const stepsListRef = useRef(null);
  const stepRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const animationFrameRef = useRef(0);
  const cooldownTimeoutRef = useRef(0);
  const wheelGestureTimeoutRef = useRef(0);
  const wheelDeltaAccumulatorRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      {
        root: isDesktop ? null : stepsListRef.current,
        rootMargin: isDesktop ? '-45% 0px -45% 0px' : '-34% 0px -34% 0px',
        threshold: 0,
      }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const content = processRef.current;
    const section = content?.closest('.story-deck__panel');
    if (!section) return undefined;

    const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const resetWheelGesture = () => {
      window.clearTimeout(wheelGestureTimeoutRef.current);
      wheelGestureTimeoutRef.current = 0;
      wheelDeltaAccumulatorRef.current = 0;
    };

    const clearAnimation = () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(cooldownTimeoutRef.current);
      resetWheelGesture();
      isAnimatingRef.current = false;
    };

    const getStepScrollPosition = (index) => {
      const step = stepRefs.current[index];
      if (!step) return window.scrollY;

      const stepTop = step.getBoundingClientRect().top + window.scrollY;
      const centeredStepTop = stepTop + step.offsetHeight * 0.5 - window.innerHeight * 0.5;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionBottom = sectionTop + section.offsetHeight - window.innerHeight;

      return clamp(centeredStepTop, sectionTop, Math.max(sectionTop, sectionBottom));
    };

    const animateToStep = (index) => {
      const targetY = Math.round(getStepScrollPosition(index));
      const startY = window.scrollY;

      isAnimatingRef.current = true;
      setActiveIndex(index);
      window.cancelAnimationFrame(animationFrameRef.current);

      const startedAt = window.performance.now();
      const tick = (now) => {
        const progress = clamp((now - startedAt) / SNAP_DURATION_MS, 0, 1);
        const nextY = startY + (targetY - startY) * EDITORIAL_EASE(progress);
        window.scrollTo(0, nextY);

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        window.scrollTo(0, targetY);
        cooldownTimeoutRef.current = window.setTimeout(() => {
          isAnimatingRef.current = false;
        }, SNAP_COOLDOWN_MS);
      };

      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
        isAnimatingRef.current = false;
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    const handleWheel = (event) => {
      if (!desktopMedia.matches || prefersReducedMotion) return;
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      if (Math.abs(event.deltaY) < WHEEL_DELTA_THRESHOLD) return;

      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      if (rect.top > viewportCenter || rect.bottom < viewportCenter) return;

      if (isAnimatingRef.current) {
        event.preventDefault();
        return;
      }

      wheelDeltaAccumulatorRef.current += event.deltaY;
      window.clearTimeout(wheelGestureTimeoutRef.current);
      wheelGestureTimeoutRef.current = window.setTimeout(resetWheelGesture, WHEEL_GESTURE_RESET_MS);

      if (Math.abs(wheelDeltaAccumulatorRef.current) < WHEEL_GESTURE_THRESHOLD) return;

      const direction = wheelDeltaAccumulatorRef.current > 0 ? 1 : -1;
      resetWheelGesture();

      const nextIndex = activeIndexRef.current + direction;
      if (nextIndex < 0 || nextIndex >= processSteps.length) return;

      event.preventDefault();
      animateToStep(nextIndex);
    };

    section.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      clearAnimation();
      section.removeEventListener('wheel', handleWheel);
    };
  }, [prefersReducedMotion]);

  const active = processSteps[activeIndex];

  return (
    <Section id="processo" bg="sand" className="lg:py-0">
      <div ref={processRef} className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-section-y">
          <Eyebrow>Como funciona</Eyebrow>
          <h2 className="max-w-[16ch]">Do primeiro encontro à primeira reserva.</h2>

          <div
            className="process-image mt-10 overflow-hidden rounded-md"
            style={{ aspectRatio: '4 / 5', maxWidth: 440 }}
          >
            <img
              src={processImage.src}
              alt={processImage.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-opacity duration-slow"
            />
          </div>

          <div className="mt-8 hidden items-center gap-3 lg:flex" aria-hidden="true">
            <span className="numeral text-2">{active.number}</span>
            <span className="text-1 text-text">{active.title}</span>
          </div>
        </div>

        <ol ref={stepsListRef} className="process-steps lg:py-section-y">
          {processSteps.map((step, index) => (
            <li
              key={step.number}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-index={index}
              data-process-active={index === activeIndex ? 'true' : 'false'}
              className={cn(
                'process-step border-t border-border py-9 pl-6 transition-colors first:border-t-0 lg:min-h-[42vh] lg:py-0 lg:pt-0',
                'lg:flex lg:flex-col lg:justify-center'
              )}
              style={{
                borderLeft: `2px solid ${index === activeIndex ? 'var(--ub-mare)' : 'transparent'}`,
              }}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className={cn(
                    'numeral transition-colors',
                    index === activeIndex ? 'text-mare-soft' : 'text-ink-200'
                  )}
                >
                  {step.number}
                </span>
                <h3
                  className={cn(
                    'text-2 font-light transition-colors',
                    index === activeIndex ? 'text-text' : 'text-text-tertiary'
                  )}
                >
                  {step.title}
                </h3>
              </div>
              <p
                className={cn(
                  'mt-3 max-w-[52ch] text-0 transition-colors',
                  index === activeIndex ? 'text-text-secondary' : 'text-text-tertiary'
                )}
              >
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
