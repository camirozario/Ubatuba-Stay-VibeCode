import { philosophyImage } from '../../data/images';
import { Eyebrow } from '../ui/Eyebrow';
import { Media } from '../ui/Media';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Section } from '../layout/Section';

/**
 * 02 — Mais do que co-hosting.
 * Composição assimétrica: texto editorial de um lado, fotografia grande
 * ultrapassando a coluna do outro. Sem cards — a lista de elementos vira
 * uma linha corrida, não uma grade.
 */
export function Philosophy() {
  const textReveal = useScrollReveal();
  const imageReveal = useScrollReveal({ threshold: 0.05 });

  return (
    <Section id="sobre" bg="sand" className="overflow-hidden">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div ref={textReveal} className="reveal lg:order-1 lg:pr-6">
          <Eyebrow>Mais do que co-hosting</Eyebrow>
          <h2 className="max-w-[14ch]">Mais do que administrar reservas.</h2>
          <p className="mt-6 text-1 text-text-secondary">
            Uma excelente hospedagem é o resultado de vários elementos funcionando juntos:
            apresentação, limpeza, comunicação, organização, manutenção, operação e atenção ao
            hóspede. Observamos a experiência de hospedagem por inteiro — não só mensagens e
            reservas.
          </p>
          <p className="quote mt-10 max-w-[22ch]">
            “Uma boa hospedagem começa muito antes do check-in.”
          </p>
        </div>

        <div ref={imageReveal} className="reveal lg:order-2 lg:-mr-[calc(var(--gutter)*1.4)] lg:col-span-1">
          <Media image={philosophyImage} aspect="4 / 5" className="w-full" />
        </div>
      </div>
    </Section>
  );
}
