import { useEffect, useRef, useState } from 'react';
import { galleryImages } from '../../data/images';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Eyebrow } from '../ui/Eyebrow';

const INTERACTIVE_DESKTOP_MEDIA_QUERY =
  '(min-width: 1024px) and (max-height: 939px) and (hover: hover) and (pointer: fine)';
const SNAP_DURATION_MS = 820;
const PAGE_SNAP_DURATION_MS = 600;
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

function getSiblingSection(section, direction) {
  let sibling = direction > 0 ? section.nextElementSibling : section.previousElementSibling;

  while (sibling) {
    if (sibling.classList?.contains('story-deck__panel')) return sibling;
    sibling = direction > 0 ? sibling.nextElementSibling : sibling.previousElementSibling;
  }

  return null;
}

export function Photography() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const trackRef = useRef(null);
  const activeIndexRef = useRef(0);
  const frameOffsetRef = useRef(0);
  const trackOffsetRef = useRef(0);
  const animationFrameRef = useRef(0);
  const cooldownTimeoutRef = useRef(0);
  const wheelGestureTimeoutRef = useRef(0);
  const wheelDeltaAccumulatorRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isGalleryRevealedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const section = sectionRef.current;
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!section || !frame || !track) return undefined;

    const desktopMedia = window.matchMedia(INTERACTIVE_DESKTOP_MEDIA_QUERY);

    const resetWheelGesture = () => {
      window.clearTimeout(wheelGestureTimeoutRef.current);
      wheelGestureTimeoutRef.current = 0;
      wheelDeltaAccumulatorRef.current = 0;
    };

    const setFrameOffset = (value) => {
      frameOffsetRef.current = value;
      frame.style.transform = `translate3d(0, ${value}px, 0)`;
    };

    const setTrackOffset = (value) => {
      trackOffsetRef.current = value;
      track.style.transform = `translate3d(${value}px, 0, 0)`;
    };

    const getTrackOffsetForIndex = (index) => {
      const figures = Array.from(track.querySelectorAll('figure'));
      const target = figures[index];
      if (!target) return 0;

      const maxOffset = Math.max(track.scrollWidth - section.clientWidth, 0);
      return -Math.min(target.offsetLeft - figures[0].offsetLeft, maxOffset);
    };

    const finishAnimation = () => {
      window.clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, SNAP_COOLDOWN_MS);
    };

    const animate = ({ from, to, duration = SNAP_DURATION_MS, onUpdate, onComplete }) => {
      window.cancelAnimationFrame(animationFrameRef.current);
      isAnimatingRef.current = true;

      if (prefersReducedMotion) {
        onUpdate(to);
        onComplete?.();
        finishAnimation();
        return;
      }

      const startedAt = window.performance.now();
      const tick = (now) => {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        onUpdate(from + (to - from) * EDITORIAL_EASE(progress));

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        onUpdate(to);
        onComplete?.();
        finishAnimation();
      };

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    const resetGallery = () => {
      isGalleryRevealedRef.current = false;
      setActiveIndex(0);
      setFrameOffset(0);
      setTrackOffset(0);
    };

    const revealGallery = () => {
      const targetOffset = Math.min(0, window.innerHeight - track.getBoundingClientRect().bottom - 24);

      animate({
        from: frameOffsetRef.current,
        to: targetOffset,
        onUpdate: setFrameOffset,
        onComplete: () => {
          isGalleryRevealedRef.current = true;
        },
      });
    };

    const animateToPhoto = (index) => {
      setActiveIndex(index);
      animate({
        from: trackOffsetRef.current,
        to: getTrackOffsetForIndex(index),
        onUpdate: setTrackOffset,
      });
    };

    const leavePhotography = (direction) => {
      const targetSection = getSiblingSection(section, direction);
      if (!targetSection) return;

      const targetY = Math.max(0, Math.round(targetSection.getBoundingClientRect().top + window.scrollY));
      animate({
        from: window.scrollY,
        to: targetY,
        duration: PAGE_SNAP_DURATION_MS,
        onUpdate: (value) => window.scrollTo(0, value),
        onComplete: resetGallery,
      });
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
      event.preventDefault();

      if (!isGalleryRevealedRef.current) {
        if (direction > 0) revealGallery();
        else leavePhotography(direction);
        return;
      }

      const nextIndex = activeIndexRef.current + direction;
      if (nextIndex >= 0 && nextIndex < galleryImages.length) {
        animateToPhoto(nextIndex);
        return;
      }

      if (direction < 0) {
        animate({
          from: frameOffsetRef.current,
          to: 0,
          onUpdate: setFrameOffset,
          onComplete: () => {
            isGalleryRevealedRef.current = false;
          },
        });
        return;
      }

      leavePhotography(direction);
    };

    const handleResize = () => {
      if (!desktopMedia.matches) return;
      if (!isGalleryRevealedRef.current) setFrameOffset(0);
      setTrackOffset(getTrackOffsetForIndex(activeIndexRef.current));
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize, { passive: true });
    desktopMedia.addEventListener('change', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(cooldownTimeoutRef.current);
      resetWheelGesture();
      section.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      desktopMedia.removeEventListener('change', handleResize);
      frame.style.transform = '';
      track.style.transform = '';
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="fotografia"
      aria-label="Fotografia profissional"
      data-section-scroll-mode="native"
      className="photography-section story-deck__panel bg-costa"
    >
      <div className="photography-viewport story-deck__surface relative overflow-hidden">
        <div ref={frameRef} className="photography-frame">
          <div className="section pb-8 lg:h-screen lg:pb-0">
            <div className="mx-auto w-full max-w-container px-gutter lg:pt-4">
              <Eyebrow inverse>Fotografia profissional</Eyebrow>
              <h2 className="section-heading--half section-title--white">
                A primeira experiÃªncia acontece antes da reserva.
              </h2>
              <p className="mt-6 max-w-[56ch] text-1 text-inverse-secondary">
                NÃ£o Ã© sÃ³ produzir fotografias bonitas â€” Ã© apresentar corretamente os ambientes,
                valorizar os diferenciais do imÃ³vel e construir uma apresentaÃ§Ã£o coerente para as
                plataformas de hospedagem. Pode ser contratada individualmente ou como parte da
                preparaÃ§Ã£o inicial do imÃ³vel.
              </p>
            </div>

            <div
              ref={trackRef}
              className="photography-track no-scrollbar mt-10 flex gap-5 overflow-x-auto px-gutter [scroll-snap-type:x_mandatory] lg:mt-14 lg:w-max lg:gap-8 lg:overflow-visible lg:[scroll-snap-type:none]"
            >
              {galleryImages.map((image, index) => (
                <figure
                  key={image.src}
                  className="w-[78vw] shrink-0 [scroll-snap-align:start] sm:w-[54vw] lg:w-[36vw] xl:w-[30vw]"
                >
                  <div className="overflow-hidden rounded-md" style={{ aspectRatio: '4 / 5' }}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-xs tracking-nav text-inverse-muted">
                    {String(index + 1).padStart(2, '0')}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
