import { useEffect, useRef, useState } from 'react';
import { services } from '../../data/services';
import { Eyebrow } from '../ui/Eyebrow';
import { Media } from '../ui/Media';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Section } from '../layout/Section';

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const SNAP_DURATION_MS = 860;
const PAGE_SNAP_DURATION_MS = 600;
const SNAP_COOLDOWN_MS = 140;
const WHEEL_DELTA_THRESHOLD = 2;
const WHEEL_GESTURE_THRESHOLD = 18;
const WHEEL_GESTURE_RESET_MS = 160;
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
  const progressRef = useRef(null);
  const goToServiceRef = useRef(null);
  const activeIndexRef = useRef(0);
  const animationFrameRef = useRef(0);
  const cooldownTimeoutRef = useRef(0);
  const wheelGestureTimeoutRef = useRef(0);
  const wheelDeltaAccumulatorRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const panelRefs = useRef([]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const showcase = showcaseRef.current;
    const stage = stageRef.current;
    const progress = progressRef.current;
    const section = showcase?.closest('.story-deck__panel');
    if (!showcase || !stage || !progress || !section) return undefined;

    const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);
    let stageScrollFrame = 0;

    const finishAnimation = () => {
      window.clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = window.setTimeout(() => {
        stage.style.scrollSnapType = '';
        isAnimatingRef.current = false;
      }, SNAP_COOLDOWN_MS);
    };

    const resetWheelGesture = () => {
      window.clearTimeout(wheelGestureTimeoutRef.current);
      wheelGestureTimeoutRef.current = 0;
      wheelDeltaAccumulatorRef.current = 0;
    };

    const clearAnimationState = () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(cooldownTimeoutRef.current);
      stage.style.scrollSnapType = '';
      resetWheelGesture();
      isAnimatingRef.current = false;
    };

    const resetStageToFirstItem = () => {
      activeIndexRef.current = 0;
      setActiveIndex(0);
      setProgressPosition(0);
      stage.scrollLeft = 0;
    };

    const animateStageToIndex = (nextIndex) => {
      const clampedIndex = clamp(nextIndex, 0, services.length - 1);
      const firstPanel = panelRefs.current[0];
      const targetPanel = panelRefs.current[clampedIndex];
      const maxScroll = Math.max(stage.scrollWidth - stage.clientWidth, 0);
      const targetLeft = targetPanel
        ? clamp(targetPanel.offsetLeft - (firstPanel?.offsetLeft ?? 0), 0, maxScroll)
        : stage.clientWidth * clampedIndex;

      window.cancelAnimationFrame(animationFrameRef.current);
      stage.style.scrollSnapType = 'none';
      isAnimatingRef.current = true;
      setActiveIndex(clampedIndex);

      animationFrameRef.current = tweenValue({
        from: stage.scrollLeft,
        to: targetLeft,
        duration: prefersReducedMotion ? 0 : SNAP_DURATION_MS,
        onUpdate: (value) => {
          stage.scrollLeft = value;
          setProgressPosition(value / Math.max(maxScroll, 1));
        },
        onComplete: finishAnimation,
      });
    };

    goToServiceRef.current = animateStageToIndex;

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
        duration: prefersReducedMotion ? 0 : PAGE_SNAP_DURATION_MS,
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
      setProgressPosition(activeIndexRef.current / Math.max(services.length - 1, 1));
    };

    const getProgressPosition = (clientX) => {
      const rect = progress.getBoundingClientRect();
      return clamp((clientX - rect.left) / rect.width, 0, 1);
    };

    const syncStageToProgress = (position) => {
      const maxScroll = Math.max(stage.scrollWidth - stage.clientWidth, 0);
      const nextIndex = Math.round(position * (services.length - 1));

      stage.scrollLeft = maxScroll * position;
      setProgressPosition(position);

      if (nextIndex === activeIndexRef.current) return;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };

    let isDraggingProgress = false;
    let didDragProgress = false;
    let progressPointerStart = 0;

    const handleProgressPointerDown = (event) => {
      if (prefersReducedMotion) return;

      event.preventDefault();
      isDraggingProgress = true;
      didDragProgress = false;
      progressPointerStart = event.clientX;
      progress.dataset.dragging = 'true';
      stage.style.scrollSnapType = 'none';
      progress.setPointerCapture?.(event.pointerId);
    };

    const handleProgressPointerMove = (event) => {
      if (!isDraggingProgress) return;

      if (Math.abs(event.clientX - progressPointerStart) > 3) {
        didDragProgress = true;
      }

      if (!didDragProgress) return;

      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(cooldownTimeoutRef.current);
      isAnimatingRef.current = false;

      syncStageToProgress(getProgressPosition(event.clientX));
    };

    const handleProgressPointerUp = (event) => {
      if (!isDraggingProgress) return;

      isDraggingProgress = false;
      delete progress.dataset.dragging;
      progress.releasePointerCapture?.(event.pointerId);
      const position = getProgressPosition(event.clientX);
      syncStageToProgress(position);
      animateStageToIndex(Math.round(position * (services.length - 1)));
    };

    const handleProgressKeyDown = (event) => {
      if (!desktopMedia.matches || prefersReducedMotion) return;

      const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!direction) return;

      event.preventDefault();
      animateStageToIndex(activeIndexRef.current + direction);
    };

    const handleWheel = (event) => {
      if (!desktopMedia.matches || prefersReducedMotion) return;
      if (!isSectionInControl(section)) return;

      const eventTarget = event.target instanceof Element ? event.target : null;
      if (eventTarget && !section.contains(eventTarget)) return;

      if (isAnimatingRef.current) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      if (Math.abs(event.deltaY) < WHEEL_DELTA_THRESHOLD) return;

      wheelDeltaAccumulatorRef.current += event.deltaY;
      window.clearTimeout(wheelGestureTimeoutRef.current);
      wheelGestureTimeoutRef.current = window.setTimeout(resetWheelGesture, WHEEL_GESTURE_RESET_MS);

      if (Math.abs(wheelDeltaAccumulatorRef.current) < WHEEL_GESTURE_THRESHOLD) return;

      const direction = wheelDeltaAccumulatorRef.current > 0 ? 1 : -1;
      resetWheelGesture();

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

    const syncMobileActiveItem = () => {
      stageScrollFrame = 0;
      if (desktopMedia.matches) return;

      const stageCenter = stage.scrollLeft + stage.clientWidth * 0.5;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;

        const panelCenter = panel.offsetLeft + panel.offsetWidth * 0.5;
        const distance = Math.abs(panelCenter - stageCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      if (nearestIndex === activeIndexRef.current) return;
      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex);
    };

    const handleStageScroll = () => {
      if (stageScrollFrame) return;
      stageScrollFrame = window.requestAnimationFrame(syncMobileActiveItem);
    };

    syncStagePosition();
    section.addEventListener('wheel', handleWheel, { passive: false });
    progress.addEventListener('pointerdown', handleProgressPointerDown);
    progress.addEventListener('pointermove', handleProgressPointerMove);
    progress.addEventListener('pointerup', handleProgressPointerUp);
    progress.addEventListener('pointercancel', handleProgressPointerUp);
    progress.addEventListener('keydown', handleProgressKeyDown);
    stage.addEventListener('scroll', handleStageScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    desktopMedia.addEventListener('change', handleResize);

    return () => {
      clearAnimationState();
      window.cancelAnimationFrame(stageScrollFrame);
      goToServiceRef.current = null;
      section.removeEventListener('wheel', handleWheel);
      progress.removeEventListener('pointerdown', handleProgressPointerDown);
      progress.removeEventListener('pointermove', handleProgressPointerMove);
      progress.removeEventListener('pointerup', handleProgressPointerUp);
      progress.removeEventListener('pointercancel', handleProgressPointerUp);
      progress.removeEventListener('keydown', handleProgressKeyDown);
      stage.removeEventListener('scroll', handleStageScroll);
      window.removeEventListener('resize', handleResize);
      desktopMedia.removeEventListener('change', handleResize);
    };
  }, [prefersReducedMotion]);

  const handleProgressClick = (event) => {
    const progress = event.currentTarget;
    const rect = progress.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    goToServiceRef.current?.(Math.round(ratio * (services.length - 1)));
  };

  return (
    <Section id="servicos" className="services-section overflow-hidden" scrollMode="native">
      <div ref={showcaseRef} className="services-showcase">
        <div className="services-showcase__inner">
          <div className="services-showcase__header">
            <div className="section-heading--half services-showcase__heading">
              <Eyebrow>Serviços</Eyebrow>
              <h2>O segredo da estadia perfeita</h2>
            </div>

            <div
              ref={progressRef}
              className="services-progress"
              onClick={handleProgressClick}
              role="slider"
              tabIndex={0}
              aria-label="Navegar entre serviÃ§os"
              aria-valuemin={1}
              aria-valuemax={services.length}
              aria-valuenow={activeIndex + 1}
              aria-valuetext={`ServiÃ§o ${activeIndex + 1} de ${services.length}`}
            >
              <span className="services-progress__track">
                <span
                  aria-hidden="true"
                  className="services-progress__thumb"
                  style={{
                    width: `${100 / services.length}%`,
                    transform: `translate3d(${progressPosition * (services.length - 1) * 100}%, 0, 0)`,
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
