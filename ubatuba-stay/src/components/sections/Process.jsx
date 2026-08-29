import { useEffect, useRef, useState } from 'react';
import { processSteps } from '../../data/process';
import { processImage } from '../../data/images';
import { Eyebrow } from '../ui/Eyebrow';
import { Section } from '../layout/Section';
import { cn } from '../../utils/cn';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const active = processSteps[activeIndex];

  return (
    <Section id="processo" bg="sand" className="lg:py-0">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Coluna fixa */}
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-section-y">
          <Eyebrow>Como funciona</Eyebrow>
          <h2 className="max-w-[16ch]">Do primeiro encontro à primeira reserva.</h2>

          <div className="mt-10 overflow-hidden rounded-md" style={{ aspectRatio: '4 / 5', maxWidth: 440 }}>
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

        {/* Etapas */}
        <ol className="lg:py-section-y">
          {processSteps.map((step, index) => (
            <li
              key={step.number}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-index={index}
              className={cn(
                'border-t border-border py-9 pl-6 transition-colors first:border-t-0 lg:min-h-[42vh] lg:py-0 lg:pt-0',
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
