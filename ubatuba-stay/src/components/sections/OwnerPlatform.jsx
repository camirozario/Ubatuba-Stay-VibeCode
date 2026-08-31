import { useEffect, useRef } from 'react';
import { CalendarDays, Wallet, Sparkles, MessageSquare } from 'lucide-react';
import { Eyebrow } from '../ui/Eyebrow';
import { Section } from '../layout/Section';
import { ensureGsapRegistered, prefersReducedMotion } from '../../utils/gsapSetup';

const RESERVATIONS = [
  { property: 'Casa Maré', guest: 'Mariana C.', status: 'success', label: 'Confirmada', nights: 4 },
  { property: 'Villa Serena', guest: 'Tomás H.', status: 'warning', label: 'Aguardando', nights: 7 },
  { property: 'Refúgio Prumirim', guest: 'Ana L.', status: 'neutral', label: 'Rascunho', nights: 2 },
];

const STATUS_CLASS = {
  success: 'badge--success',
  warning: 'badge--warning',
  neutral: '',
};

/**
 * Mockup construído em HTML/CSS (não é uma captura de tela real) que
 * representa, de forma abstrata, a plataforma do proprietário: calendário,
 * reservas e indicadores operacionais. Substitua por capturas de tela reais
 * da plataforma assim que disponíveis — a estrutura (PlatformMockup) foi
 * pensada para ser trocada por um <img> sem alterar o layout ao redor.
 */
function PlatformMockup({ mockupRef }) {
  return (
    <div
      ref={mockupRef}
      className="mx-auto w-full max-w-[880px] rounded-lg border border-border bg-surface shadow-modal"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-pill bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-pill bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-pill bg-mare" />
        </div>
        <div className="flex gap-6 text-xs tracking-nav text-text-tertiary">
          <span className="text-text">CALENDÁRIO</span>
          <span>RESERVAS</span>
          <span>FINANCEIRO</span>
          <span className="hidden sm:inline">LIMPEZAS</span>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_1fr] md:p-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-0 text-text">
              <CalendarDays size={16} className="text-mare" aria-hidden="true" />
              Agosto 2026
            </span>
            <span className="text-xs tracking-nav text-text-tertiary">Casa Maré</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 28 }).map((_, i) => {
              const occupied = [3, 4, 5, 6, 14, 15, 16, 22, 23].includes(i);
              return (
                <span
                  key={i}
                  className="aspect-square rounded-xs"
                  style={{
                    background: occupied ? 'var(--ub-mare)' : 'var(--surface-sunken)',
                    opacity: occupied ? 0.85 : 1,
                  }}
                  aria-hidden="true"
                />
              );
            })}
          </div>
          <dl className="mt-6">
            <div className="spec-row">
              <dt className="flex items-center gap-2">
                <Wallet size={15} className="text-text-tertiary" aria-hidden="true" />
                Repasse do mês
              </dt>
              <dd>Atualizado hoje</dd>
            </div>
            <div className="spec-row">
              <dt className="flex items-center gap-2">
                <Sparkles size={15} className="text-text-tertiary" aria-hidden="true" />
                Limpezas agendadas
              </dt>
              <dd>3 esta semana</dd>
            </div>
          </dl>
        </div>

        <div>
          <span className="mb-4 flex items-center gap-2 text-0 text-text">
            <MessageSquare size={16} className="text-mare" aria-hidden="true" />
            Reservas recentes
          </span>
          <ul className="flex flex-col gap-4">
            {RESERVATIONS.map((r) => (
              <li key={r.property} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-0 text-text">{r.property}</span>
                  <span className={`badge ${STATUS_CLASS[r.status]}`}>{r.label}</span>
                </div>
                <p className="mt-1 text-xs text-text-tertiary">
                  {r.guest} · {r.nights} diárias
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OwnerPlatform() {
  const sectionRef = useRef(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (reduced) return undefined;

    const { gsap, ScrollTrigger } = ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mockupRef.current,
        { rotateX: 14, y: 60, opacity: 0, transformPerspective: 1200 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.trigger === sectionRef.current && t.kill());
    };
  }, []);

  return (
    <Section id="plataforma">
      <div ref={sectionRef} className="text-center">
        <Eyebrow className="mx-auto w-fit">Transparência</Eyebrow>
        <h2 className="mx-auto section-heading--half">Delegue a operação. Não a visibilidade.</h2>
        <p className="mx-auto mt-6 max-w-[56ch] text-1 text-text-secondary">
          Centralizamos a operação para que você acompanhe seu imóvel de forma simples,
          organizada e transparente — calendário, reservas, limpezas e informações financeiras
          num único lugar, sem abrir mão de entender o que está acontecendo.
        </p>
      </div>

      <div className="mt-14">
        <PlatformMockup mockupRef={mockupRef} />
      </div>
    </Section>
  );
}
