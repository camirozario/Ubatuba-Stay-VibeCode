import { useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { ensureGsapRegistered, prefersReducedMotion } from '../../utils/gsapSetup';

export function Hero({ contentReady = true }) {
  const sectionRef = useRef(null);
  const mediaFrameRef = useRef(null);
  const videoRef = useRef(null);
  const contentBlockRef = useRef(null);
  const headlineRef = useRef(null);
  const copyRef = useRef(null);
  const ctasRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const { gsap } = ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([mediaFrameRef.current, videoRef.current], {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
        });

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      } else {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo(
            mediaFrameRef.current,
            {
              opacity: 0.22,
              y: 78,
              rotate: 1.1,
              scale: 1.03,
              clipPath: 'inset(100% 0% 0% 0%)',
              transformOrigin: 'center bottom',
            },
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.65,
            }
          )
          .fromTo(
            videoRef.current,
            { opacity: 0.08, scale: 1.08 },
            { opacity: 1, scale: 1, duration: 1.95, ease: 'power2.out' },
            0.08
          );

        gsap.set(contentBlockRef.current, { yPercent: 0, autoAlpha: 1 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const { gsap } = ensureGsapRegistered();

    if (!contentReady) {
      gsap.set([headlineRef.current, copyRef.current, ctasRef.current], {
        autoAlpha: 0,
        y: 0,
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([headlineRef.current, copyRef.current, ctasRef.current], {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(headlineRef.current, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.02 })
        .fromTo(copyRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.88 }, '-=0.72')
        .fromTo(ctasRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.84 }, '-=0.62');
    }, sectionRef);

    return () => ctx.revert();
  }, [contentReady]);

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="story-deck__panel relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden bg-areia"
    >
      <div className="absolute inset-0 -top-[8%] h-[116%] w-full">
        <div ref={mediaFrameRef} className="h-full w-full overflow-hidden bg-areia">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={`${import.meta.env.BASE_URL}hero-video.mp4`} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(14,44,54,0.35) 0%, rgba(14,44,54,0.05) 32%, rgba(14,44,54,0.55) 100%)',
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="story-deck__surface relative z-10 w-full pb-16 pt-32 sm:pb-20 md:pb-24">
        <div className="mx-auto flex w-full max-w-container justify-end px-gutter">
          <div ref={contentBlockRef} className="ml-auto w-full max-w-[72rem] text-right">
            <div className="ml-auto w-full max-w-[38rem] lg:max-w-[50vw]">
              <h1
                ref={headlineRef}
                className="text-3 text-right text-inverse sm:text-4 lg:text-[4.5rem]"
                style={{ opacity: 0 }}
              >
                <span className="block">
                  Seu imóvel, <span className="hero__headline-highlight">cuidado</span>
                </span>
                <span className="block">
                  como uma <span className="hero__headline-highlight">experiência</span>.
                </span>
              </h1>
            </div>
            <p
              ref={copyRef}
              className="mt-6 ml-auto max-w-[46ch] text-1 font-normal text-inverse-secondary"
              style={{ opacity: 0 }}
            >
              Gestão de hospedagens, operação e apresentação profissional para imóveis por
              temporada em Ubatuba.
            </p>
            <div
              ref={ctasRef}
              className="mt-10 flex flex-wrap items-center justify-end gap-4"
              style={{ opacity: 0 }}
            >
              <Button href="#contato" variant="secondary" className="hero__cta-primary">
                Agendar uma conversa
              </Button>
              <Button href="#servicos" variant="ghost-inverse">
                Conhecer nossos serviços
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 right-gutter hidden flex-col items-end gap-3 sm:flex"
        >
          <span className="text-[10px] tracking-nav text-inverse-muted">ROLE</span>
          <span className="block h-10 w-px bg-border-inverse" />
        </div>
      </div>
    </section>
  );
}
