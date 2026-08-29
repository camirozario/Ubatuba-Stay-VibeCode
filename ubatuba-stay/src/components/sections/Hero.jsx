import { useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { ensureGsapRegistered, prefersReducedMotion } from '../../utils/gsapSetup';

/**
 * 01 - Hero.
 * Video de destaque em tela cheia, reveal de entrada em estagios
 * (headline -> texto -> CTAs, apenas opacity + pequenos deslocamentos
 * verticais) e um parallax extremamente sutil na camada de midia, ligado ao
 * scroll via GSAP ScrollTrigger com scrub. Nada gira, nada salta.
 */
export function Hero() {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const headlineRef = useRef(null);
  const copyRef = useRef(null);
  const ctasRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const { gsap, ScrollTrigger } = ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([headlineRef.current, copyRef.current, ctasRef.current], { opacity: 1, y: 0 });
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        return;
      }

      // Entrada em estagios - apenas opacity + translateY discreto.
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.fromTo(headlineRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1 })
        .fromTo(copyRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
        .fromTo(ctasRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6');

      // Parallax extremamente sutil na camada de midia.
      gsap.to(mediaRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // O indicador de scroll se apaga assim que o visitante comeca a rolar.
      gsap.to(indicatorRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '18% top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.trigger === sectionRef.current && t.kill());
    };
  }, []);

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden bg-costa"
    >
      <div ref={mediaRef} className="absolute inset-0 -top-[8%] h-[116%] w-full">
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
          <source src="/hero-video.mp4" type="video/mp4" />
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

      <div className="relative z-10 w-full pb-16 pt-32 sm:pb-20 md:pb-24">
        <div className="mx-auto w-full max-w-container px-gutter">
          <div className="max-w-[18ch]">
            <h1 ref={headlineRef} className="text-5 text-on-inverse">
              Seu imóvel, cuidado como uma experiência.
            </h1>
          </div>
          <p ref={copyRef} className="mt-6 max-w-[46ch] text-1 font-normal text-inverse-secondary">
            Gestão de hospedagens, operação e apresentação profissional para imóveis por
            temporada em Ubatuba.
          </p>
          <div ref={ctasRef} className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#contato" variant="secondary">
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
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="text-[10px] tracking-nav text-inverse-muted">ROLE</span>
        <span className="block h-10 w-px bg-border-inverse" />
      </div>
    </section>
  );
}
