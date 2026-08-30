import { useLayoutEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ensureGsapRegistered } from '../../utils/gsapSetup';
import { Logo } from './Logo';

const LOGO_ANIMATION_SECONDS = 3.7;
const MOVE_DURATION = 0.72;
const REDUCED_MOVE_DURATION = 0.44;
const FADE_DURATION = 0.12;
const HEADER_LOGO_COLOR = 'rgba(247,243,236,0.92)';
const INITIAL_LOGO_COLOR = 'rgba(31,78,95,1)';
const INITIAL_SUN_COLOR = 'var(--ub-mare)';

export function PageLoader({ targetRef, onDock, onComplete }) {
  const overlayRef = useRef(null);
  const shellRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const shell = shellRef.current;
    const { gsap } = ensureGsapRegistered();
    const previousBodyOverflow = document.body.style.overflow;
    let animationFrame = 0;
    let timeline;
    let docked = false;
    let completed = false;

    document.body.style.overflow = 'hidden';

    const finishDock = () => {
      if (docked) return;
      docked = true;
      onDock?.();
    };

    const finishLoader = () => {
      if (completed) return;
      completed = true;
      document.body.style.overflow = previousBodyOverflow;
      onComplete?.();
    };

    animationFrame = window.requestAnimationFrame(() => {
      const target = targetRef.current;

      if (!overlay || !shell || !target) {
        finishDock();
        finishLoader();
        return;
      }

      const shellRect = shell.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const deltaX = targetRect.left + targetRect.width / 2 - (shellRect.left + shellRect.width / 2);
      const deltaY = targetRect.top + targetRect.height / 2 - (shellRect.top + shellRect.height / 2);
      const scale = Math.min(targetRect.width / shellRect.width, targetRect.height / shellRect.height);
      const moveDuration = reducedMotion ? REDUCED_MOVE_DURATION : MOVE_DURATION;
      const moveStart = reducedMotion ? 0 : LOGO_ANIMATION_SECONDS;
      const fadeStart = moveStart + Math.max(0, moveDuration - FADE_DURATION);

      timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: finishLoader,
      });

      if (!reducedMotion) {
        timeline.to({}, { duration: LOGO_ANIMATION_SECONDS });
      }

      timeline
        .to(
          shell,
          {
            duration: moveDuration,
            x: deltaX,
            y: deltaY,
            scale,
            color: HEADER_LOGO_COLOR,
            '--brand-sun-color': HEADER_LOGO_COLOR,
            ease: reducedMotion ? 'power2.out' : 'power2.inOut',
          },
          moveStart
        )
        .to(
          overlay,
          {
            duration: FADE_DURATION,
            autoAlpha: 0,
            ease: 'power1.out',
          },
          fadeStart
        )
        .add(() => {
          finishDock();
          gsap.set(shell, { autoAlpha: 0 });
        }, moveStart + moveDuration);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      timeline?.kill();
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [onComplete, onDock, reducedMotion, targetRef]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] overflow-hidden bg-concha"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.64) 0%, rgba(255,255,255,0.26) 18%, transparent 44%), linear-gradient(180deg, #f8f6f2 0%, #f1ede5 100%)',
      }}
      aria-hidden="true"
    >
      <div className="absolute -left-16 top-[14%] h-44 w-44 rounded-full bg-[rgba(232,132,92,0.12)] blur-3xl sm:h-64 sm:w-64" />
      <div className="absolute bottom-[14%] right-[-8%] h-48 w-48 rounded-full bg-[rgba(31,78,95,0.08)] blur-3xl sm:h-72 sm:w-72" />

      <div className="grid h-full place-items-center">
        <div
          ref={shellRef}
          className="w-[168px] will-change-transform sm:w-[196px]"
          style={{
            transformOrigin: 'center center',
            color: INITIAL_LOGO_COLOR,
            '--brand-sun-color': INITIAL_SUN_COLOR,
          }}
        >
          <Logo
            inverse={false}
            animateOnMount={!reducedMotion}
            inkColor={null}
            sunColor="var(--brand-sun-color)"
            compactWordmark
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
