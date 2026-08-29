import { MapPin, Eye, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Eyebrow } from '../ui/Eyebrow';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Section } from '../layout/Section';

const PRINCIPLES = [
  {
    icon: MapPin,
    title: 'Presença local',
    description: 'Entendemos a realidade da operação de imóveis por temporada em Ubatuba.',
  },
  {
    icon: Eye,
    title: 'Atenção aos detalhes',
    description: 'Pequenos detalhes da operação podem transformar completamente a experiência de um hóspede.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparência',
    description: 'Se identificarmos algo que pode ser melhorado, o proprietário será informado.',
  },
  {
    icon: HeartHandshake,
    title: 'Hospitalidade',
    description: 'As decisões consideram tanto o imóvel quanto a pessoa que irá se hospedar nele.',
  },
];

function Principle({ principle, index }) {
  const reveal = useScrollReveal();
  const Icon = principle.icon;

  return (
    <div ref={reveal} className="reveal flex items-start gap-5 border-t border-border py-8 first:border-t-0 md:border-t-0 md:border-l md:py-0 md:pl-8 md:first:pl-0">
      <span className="numeral text-1 text-ink-200" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div>
        <h3 className="flex items-center gap-2 text-1 text-text">
          <Icon size={17} className="text-mare" aria-hidden="true" />
          {principle.title}
        </h3>
        <p className="mt-2 max-w-[32ch] text-0 text-text-secondary">{principle.description}</p>
      </div>
    </div>
  );
}

/**
 * 09 — Nossa forma de cuidar.
 * Quatro princípios, layout extremamente limpo — sem cards, apenas
 * hairlines verticais separando as colunas em telas largas.
 */
export function Principles() {
  const headingReveal = useScrollReveal();

  return (
    <Section id="cuidado" bg="sand">
      <div ref={headingReveal} className="reveal max-w-[26ch]">
        <Eyebrow>Nossa forma de cuidar</Eyebrow>
        <h2>Cuidar bem também significa olhar com atenção.</h2>
      </div>

      <div className="mt-14 grid gap-2 md:grid-cols-4 md:gap-8">
        {PRINCIPLES.map((principle, index) => (
          <Principle key={principle.title} principle={principle} index={index} />
        ))}
      </div>
    </Section>
  );
}
