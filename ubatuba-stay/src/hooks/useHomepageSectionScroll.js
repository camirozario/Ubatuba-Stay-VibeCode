import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const SECTION_SCROLL_DURATION_MS = 900;
const SECTION_SCROLL_COOLDOWN_MS = 140;
const WHEEL_DELTA_THRESHOLD = 10;
const SECTION_BOUNDARY_THRESHOLD = 24;
const SECTION_OVERFLOW_TOLERANCE = 96;
const SECTION_OVERFLOW_RATIO = 0.18;

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

function getSectionCenter(section) {
  return getSectionTop(section) + section.offsetHeight * 0.5;
}

function getWheelDirection(event) {
  if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return 0;
  if (Math.abs(event.deltaY) < WHEEL_DELTA_THRESHOLD) return 0;
  return event.deltaY > 0 ? 1 : -1;
}

function isNativeScrollSection(section) {
  return section?.getAttribute('data-section-scroll-mode') === 'native';
}

function findScrollableAncestor(target) {
  let node = target?.nodeType === 3 ? target.parentElement : target;

  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const canScroll =
      /(auto|scroll|overlay)/.test(overflowY) && node.scrollHeight > node.clientHeight + 1;

    if (canScroll) return node;
    node = node.parentElement;
  }

  return null;
}

function canScrollWithinElement(element, direction) {
  if (!element) return false;

  if (direction > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }

  return element.scrollTop > 1;
}

function canContinueWithinSection(section, direction) {
  const viewportHeight = window.innerHeight;
  const naturalOverflow = section.offsetHeight - viewportHeight;
  const overflowThreshold = Math.max(
    SECTION_OVERFLOW_TOLERANCE,
    viewportHeight * SECTION_OVERFLOW_RATIO
  );

  if (naturalOverflow <= overflowThreshold) return false;

  const rect = section.getBoundingClientRect();

  if (direction > 0) {
    return rect.bottom - viewportHeight > SECTION_BOUNDARY_THRESHOLD;
  }

  return rect.top < -SECTION_BOUNDARY_THRESHOLD;
}

function isViewportInsideSections(sections) {
  if (sections.length === 0) return false;

  const viewportCenter = window.scrollY + window.innerHeight * 0.5;
  const firstTop = getSectionTop(sections[0]);
  const lastSection = sections[sections.length - 1];
  const lastBottom = getSectionTop(lastSection) + lastSection.offsetHeight;

  return viewportCenter >= firstTop && viewportCenter <= lastBottom;
}

function getNearestSectionIndex(sections) {
  const viewportCenter = window.scrollY + window.innerHeight * 0.5;
  let nearestIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section, index) => {
    const distance = Math.abs(getSectionCenter(section) - viewportCenter);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

export function useHomepageSectionScroll(deckRef, { enabled = true } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeIndexRef = useRef(0);
  const animationFrameRef = useRef(0);
  const cooldownTimeoutRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof window === 'undefined') return undefined;

    const deck = deckRef.current;
    if (!deck) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);
    let sections = [];
    let sectionObserver = null;

    const collectSections = () => {
      sections = Array.from(deck.children).filter((child) =>
        child.classList.contains('story-deck__panel')
      );
      return sections;
    };

    const setActiveSection = (index) => {
      activeIndexRef.current = index;
      sections.forEach((section, sectionIndex) => {
        if (sectionIndex === index) {
          section.setAttribute('data-section-active', 'true');
          return;
        }

        section.removeAttribute('data-section-active');
      });
    };

    const clearSectionTransitionState = () => {
      sections.forEach((section) => {
        section.removeAttribute('data-section-transition');
        section.removeAttribute('data-section-transition-direction');
      });
    };

    const markSectionTransitionState = (fromIndex, toIndex, direction) => {
      clearSectionTransitionState();

      const leavingSection = sections[fromIndex];
      if (leavingSection) {
        leavingSection.setAttribute('data-section-transition', 'leaving');
        leavingSection.setAttribute(
          'data-section-transition-direction',
          direction > 0 ? 'down' : 'up'
        );
      }

      const enteringSection = sections[toIndex];
      if (enteringSection) {
        enteringSection.setAttribute('data-section-transition', 'entering');
        enteringSection.setAttribute(
          'data-section-transition-direction',
          direction > 0 ? 'down' : 'up'
        );
      }
    };

    const updateActiveSectionFromViewport = () => {
      const currentSections = collectSections();
      if (currentSections.length === 0) return;
      setActiveSection(getNearestSectionIndex(currentSections));
    };

    const clearAnimationState = () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(cooldownTimeoutRef.current);
      html.classList.remove('homepage-snap--animating');
      body.classList.remove('homepage-snap--animating');
      clearSectionTransitionState();
      isAnimatingRef.current = false;
    };

    const disconnectObserver = () => {
      sectionObserver?.disconnect();
      sectionObserver = null;
    };

    const handleResize = () => {
      collectSections();
      updateActiveSectionFromViewport();
    };

    const stopDesktopEnhancement = () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      disconnectObserver();
      clearAnimationState();
      html.classList.remove('homepage-snap--enhanced');
      body.classList.remove('homepage-snap--enhanced');
      sections.forEach((section) => {
        section.removeAttribute('data-section-active');
        section.removeAttribute('data-section-index');
      });
    };

    const animateToSection = (fromIndex, toIndex, direction) => {
      const currentSections = collectSections();
      const targetSection = currentSections[toIndex];
      if (!targetSection) return;

      const startY = window.scrollY;
      const targetY = Math.max(0, Math.round(getSectionTop(targetSection)));

      if (Math.abs(targetY - startY) < 2) {
        setActiveSection(toIndex);
        clearSectionTransitionState();
        return;
      }

      clearAnimationState();
      isAnimatingRef.current = true;
      markSectionTransitionState(fromIndex, toIndex, direction);
      html.classList.add('homepage-snap--animating');
      body.classList.add('homepage-snap--animating');

      const startedAt = window.performance.now();

      const tick = (now) => {
        const elapsed = now - startedAt;
        const progress = clamp(elapsed / SECTION_SCROLL_DURATION_MS, 0, 1);
        const easedProgress = EDITORIAL_EASE(progress);
        const nextY = startY + (targetY - startY) * easedProgress;

        window.scrollTo(0, nextY);

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        window.scrollTo(0, targetY);
        setActiveSection(toIndex);

        cooldownTimeoutRef.current = window.setTimeout(() => {
          html.classList.remove('homepage-snap--animating');
          body.classList.remove('homepage-snap--animating');
          clearSectionTransitionState();
          isAnimatingRef.current = false;
        }, SECTION_SCROLL_COOLDOWN_MS);
      };

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    const handleWheel = (event) => {
      if (!desktopMedia.matches) return;
      if (body.style.overflow === 'hidden') return;

      const direction = getWheelDirection(event);
      if (!direction) return;

      const currentSections = collectSections();
      if (currentSections.length < 2) return;
      if (!isViewportInsideSections(currentSections)) return;

      if (isAnimatingRef.current) {
        event.preventDefault();
        return;
      }

      const scrollableAncestor = findScrollableAncestor(event.target);
      if (scrollableAncestor && canScrollWithinElement(scrollableAncestor, direction)) {
        return;
      }

      const currentIndex = getNearestSectionIndex(currentSections);
      const currentSection = currentSections[currentIndex];
      if (!currentSection) return;

      const targetSection =
        event.target instanceof Element ? event.target.closest('.story-deck__panel') : null;

      if (isNativeScrollSection(targetSection) || isNativeScrollSection(currentSection)) {
        return;
      }

      if (canContinueWithinSection(currentSection, direction)) {
        return;
      }

      const targetIndex = clamp(currentIndex + direction, 0, currentSections.length - 1);
      if (targetIndex === currentIndex) return;

      event.preventDefault();
      animateToSection(currentIndex, targetIndex, direction);
    };

    const startSectionObserver = () => {
      disconnectObserver();

      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const index = Number(entry.target.getAttribute('data-section-index'));
            if (Number.isNaN(index)) return;
            setActiveSection(index);
          });
        },
        {
          root: null,
          threshold: 0,
          rootMargin: '-49% 0px -49% 0px',
        }
      );

      sections.forEach((section, index) => {
        section.setAttribute('data-section-index', String(index));
        sectionObserver.observe(section);
      });
    };

    const startDesktopEnhancement = () => {
      collectSections();
      startSectionObserver();
      updateActiveSectionFromViewport();
      html.classList.add('homepage-snap--enhanced');
      body.classList.add('homepage-snap--enhanced');
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('resize', handleResize, { passive: true });
    };

    const syncMode = () => {
      stopDesktopEnhancement();
      html.classList.remove('homepage-snap');
      body.classList.remove('homepage-snap');

      if (prefersReducedMotion) return;

      html.classList.add('homepage-snap');
      body.classList.add('homepage-snap');

      if (desktopMedia.matches) {
        startDesktopEnhancement();
      }
    };

    syncMode();
    desktopMedia.addEventListener('change', syncMode);

    return () => {
      desktopMedia.removeEventListener('change', syncMode);
      stopDesktopEnhancement();
      html.classList.remove('homepage-snap');
      body.classList.remove('homepage-snap');
    };
  }, [deckRef, enabled, prefersReducedMotion]);
}
