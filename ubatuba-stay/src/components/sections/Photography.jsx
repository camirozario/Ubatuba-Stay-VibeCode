import { useEffect, useRef } from 'react';
import { galleryImages } from '../../data/images';
import { Eyebrow } from '../ui/Eyebrow';
import { ensureGsapRegistered } from '../../utils/gsapSetup';

/**
 * 04 — Fotografia profissional.
 * Em telas grandes: uma seção fixada (pin) enquanto a trilha de fotos
 * avança horizontalmente com o scroll vertical (GSAP ScrollTrigger).
 * Em telas pequenas: nada de pin — vira uma faixa com scroll-snap nativo,
 * navegável por swipe, sem custo de performance do pin em mobile.
 */
export function Photography() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsapRegistered();
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { isDesktop } = context.conditions;
        if (!isDesktop) return undefined;

        const track = trackRef.current;
        const distance = track.scrollWidth - window.innerWidth;
        if (distance <= 0) return undefined;

        const tween = gsap.to(track, {
          x: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${distance}`,
            scrub: 0.4,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.scrollTrigger?.kill();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="fotografia" aria-label="Fotografia profissional" className="bg-costa">
      <div ref={sectionRef} className="relative overflow-hidden">
        <div className="section pb-8 lg:h-screen lg:pb-0">
          <div className="mx-auto w-full max-w-container px-gutter lg:pt-4">
            <Eyebrow inverse>Fotografia profissional</Eyebrow>
            <h2 className="max-w-[20ch] text-on-inverse">
              A primeira experiência acontece antes da reserva.
            </h2>
            <p className="mt-6 max-w-[56ch] text-1 text-inverse-secondary">
              Não é só produzir fotografias bonitas — é apresentar corretamente os ambientes,
              valorizar os diferenciais do imóvel e construir uma apresentação coerente para as
              plataformas de hospedagem. Pode ser contratada individualmente ou como parte da
              preparação inicial do imóvel.
            </p>
          </div>

          <div
            ref={trackRef}
            className="no-scrollbar mt-10 flex gap-5 overflow-x-auto px-gutter [scroll-snap-type:x_mandatory] lg:mt-14 lg:w-max lg:gap-8 lg:overflow-visible lg:[scroll-snap-type:none]"
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
    </section>
  );
}
