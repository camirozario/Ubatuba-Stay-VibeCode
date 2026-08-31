import { useEffect, useRef, useState } from 'react';
import { services } from '../../data/services';
import { Eyebrow } from '../ui/Eyebrow';
import { Media } from '../ui/Media';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Section } from '../layout/Section';

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const SNAP_DURATION_MS = 860;
const SNAP_COOLDOWN_MS = 140;
const WHEEL_DELTA_THRESHOLD = 10;
const SECTION_CONTROL_MARGIN = 0.18;

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
  if (x1 === y1 && x2 === y2) {
    return (value) => value;
  }

  return (value) => {
    let lower = 0;
    let upper = 1;
    let estimate = value;

    for (let index = 0; index < 7; index += 1) {
      const slope = cubicBezierSlope(estimate, x1, x2);
      if (Math.abs(slope) < 0.001) break;
      const currentX = cubicBezierPoint(estimate, x1, x2) - value;
      estimate -= currentX / slope;
    }

    while (lower < upper) {
      const currentX = cubicBezierPoint(estimate, x1, x2);
      if (Math.abs(currentX - value) < 0.0001) {
        return cubicBezierPoint(estimate, y1, y2);
      }

      if (value > currentX) {
        lower = estimate;
      } else {
        upper = estimate;
      }

      const nextEstimate = (upper - lower) * 0.5 + lower;
      if (Math.abs(nextEstimate - estimate) < 0.0001) break;
      estimate = nextEstimate;
    }

    return cubicBezierPoint(estimate, y1, y2);
  };
}

const EDITORIAL_EASE = createBezierEasing(0.76, 0, 0.24, 1);

function getWheelDirection(event) {
  if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return 0;
  if (Math.abs(event.deltaY) < WHEEL_DELTA_THRESHOLD) return 0;
  return event.deltaY > 0 ? 1 : -1;
}

function getSectionTop(section) {
  return section.getBoundingClientRect().top + window.scrollY;
}

function isSectionInControl(section) {
  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  return (
    rect.top <= viewportHeight * SECTION_CONTROL_MARGIN &&
    rect.bottom >= viewportHeight * (1 - SECTION_CONTROL_MARGIN)
  );
}

function getSiblingSection(section, direction) {
  let sibling = direction > 0 ? section.nextElementSibling : section.previousElementSibling;

  while (sibling) {
    if (sibling.classList?.contains('story-deck__panel')) {
      return sibling;
    }

    sibling = direction > 0 ? sibling.nextElementSibling : sibling.previousElementSibling;
  }

  return null;
}

function tweenValue({ from, to, duration, onUpdate, onComplete }) {
  if (duration <= 0 || Math.abs(to - from) < 1) {
    onUpdate(to);
    onComplete?.();
    return 0;
  }

  const startedAt = window.performance.now();
  let frame = 0;

  const tick = (now) => {
    const elapsed = now - startedAt;
    const progress = clamp(elapsed / duration, 0, 1);
    const easedProgress = EDITORIAL_EASE(progress);
    const nextValue = from + (to - from) * easedProgress;

    onUpdate(nextValue);

    if (progress < 1) {
      frame = window.requestAnimationFrame(tick);
      return;
    }

    onUpdate(to);
    onComplete?.();
  };

  frame = window.requestAnimationFrame(tick);
  return frame;
}

function ServicePanel({ service, index, panelRefs, isActive }) {
  return (
    <article
      ref={(node) => {
        panelRefs.current[index] = node;
      }}
      data-service-active={isActive ? 'true' : 'false'}
      className="services-panel w-[85vw] shrink-0 bg-concha p-5 [scroll-snap-align:start] sm:w-[31rem] lg:w-full lg:shrink-0 lg:p-6 xl:p-8"
    >
      <div className="services-panel__body">
        <div data-service-title className="services-panel__title flex items-baseline gap-5">
          <span className="numeral">{service.number}</span>
          <h3 className="max-w-[13ch] text-3 font-light text-text">{service.title}</h3>
        </div>

        <p data-service-text className="services-panel__text mt-4 max-w-[56ch] text-1 text-text-secondary">
          {service.description}
        </p>

        <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {service.items.map((item) => (
            <li
              key={item}
              data-service-item
              className="services-panel__item flex items-start gap-3 text-0 text-text-secondary"
            >
              <span aria-hidden="true" className="mt-[11px] h-px w-2 shrink-0 bg-mare" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div data-service-image className="services-panel__image overflow-hidden">
        <Media image={service.image} aspect="4 / 3" className="services-panel__media" />
      </div>
    </article>
  );
}

export function Services() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const showcaseRef = useRef(null);
  const stageRef = useRef(null);
  const activeIndexRef = useRef(0);
  const animationFrameRef = useRef(0);
  const cooldownTimeoutRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef([]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const showcase = showcaseRef.current;
    const stage = stageRef.current;
    const section = showcase?.closest('.story-deck__panel');
    if (!showcase || !stage || !section) return undefined;

    const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const finishAnimation = () => {
      window.clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, SNAP_COOLDOWN_MS);
    };

    const clearAnimationState = () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(cooldownTimeoutRef.current);
      isAnimatingRef.current = false;
    };

    const resetStageToFirstItem = () => {
      activeIndexRef.current = 0;
      setActiveIndex(0);
      stage.scrollLeft = 0;
    };

    const animateStageToIndex = (nextIndex) => {
      const clampedIndex = clamp(nextIndex, 0, services.length - 1);
      const targetLeft = stage.clientWidth * clampedIndex;

      window.cancelAnimationFrame(animationFrameRef.current);
      isAnimatingRef.current = true;
      setActiveIndex(clampedIndex);

      animationFrameRef.current = tweenValue({
        from: stage.scrollLeft,
        to: targetLeft,
        duration: prefersReducedMotion ? 0 : SNAP_DURATION_MS,
        onUpdate: (value) => {
          stage.scrollLeft = value;
        },
        onComplete: finishAnimation,
      });
    };

    const animatePageToSibling = (direction) => {
      const targetSection = getSiblingSection(section, direction);
      if (!targetSection) {
        isAnimatingRef.current = false;
        return;
      }

      const shouldResetOnExit = direction > 0 && targetSection.id === 'fotografia';

      const targetY = Math.max(0, Math.round(getSectionTop(targetSection)));

      window.cancelAnimationFrame(animationFrameRef.current);
      isAnimatingRef.current = true;

      animationFrameRef.current = tweenValue({
        from: window.scrollY,
        to: targetY,
        duration: prefersReducedMotion ? 0 : SNAP_DURATION_MS,
        onUpdate: (value) => {
          window.scrollTo(0, value);
        },
        onComplete: () => {
          if (shouldResetOnExit) {
            resetStageToFirstItem();
          }

          finishAnimation();
        },
      });
    };

    const syncStagePosition = () => {
      if (!desktopMedia.matches) return;
      stage.scrollLeft = stage.clientWidth * activeIndexRef.current;
    };

    const handleWheel = (event) => {
      if (!desktopMedia.matches || prefersReducedMotion) return;

      const direction = getWheelDirection(event);
      if (!direction) return;
      if (!isSectionInControl(section)) return;

      const eventTarget = event.target instanceof Element ? event.target : null;
      if (eventTarget && !section.contains(eventTarget)) return;

      if (isAnimatingRef.current) {
        event.preventDefault();
        return;
      }

      const nextIndex = activeIndexRef.current + direction;

      if (nextIndex >= 0 && nextIndex < services.length) {
        event.preventDefault();
        animateStageToIndex(nextIndex);
        return;
      }

      event.preventDefault();
      animatePageToSibling(direction);
    };

    const handleResize = () => {
      syncStagePosition();
    };

    syncStagePosition();
    section.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize, { passive: true });
    desktopMedia.addEventListener('change', handleResize);

    return () => {
      clearAnimationState();
      section.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      desktopMedia.removeEventListener('change', handleResize);
    };
  }, [prefersReducedMotion]);

  return (
    <Section id="servicos" className="services-section overflow-hidden" scrollMode="native">
      <div ref={showcaseRef} className="services-showcase">
        <div className="services-showcase__inner">
          <div className="services-showcase__header">
            <div className="section-heading--half services-showcase__heading">
              <Eyebrow>Serviços</Eyebrow>
              <h2>O segredo da estadia perfeita</h2>
            </div>

            <div className="services-progress" aria-hidden="true">
              <span className="services-progress__track">
                <span
                  className="services-progress__thumb"
                  style={{
                    width: `${100 / services.length}%`,
                    transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
                  }}
                />
              </span>
            </div>
          </div>

          <div ref={stageRef} className="services-stage no-scrollbar">
            {services.map((service, index) => (
              <ServicePanel
                key={service.number}
                service={service}
                index={index}
                panelRefs={panelRefs}
                isActive={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
