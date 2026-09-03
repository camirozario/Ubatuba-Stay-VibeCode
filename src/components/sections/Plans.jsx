import { Check } from 'lucide-react';
import { plans, addOns } from '../../data/plans';
import { Eyebrow } from '../ui/Eyebrow';
import { Button } from '../ui/Button';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Section } from '../layout/Section';
import { cn } from '../../utils/cn';

function PlanColumn({ plan }) {
  const reveal = useScrollReveal();

  return (
    <div
      ref={reveal}
      className={cn(
        'reveal flex flex-col border-t-2 pt-8',
        plan.highlighted ? 'border-mare' : 'border-border-strong'
      )}
    >
      {plan.highlighted && <Eyebrow className="mb-2">Mais procurado</Eyebrow>}
      <h3 className="text-2 font-light text-text">{plan.name}</h3>
      <p className="mt-3 max-w-[38ch] text-0 text-text-secondary">{plan.tagline}</p>

      <ul className="mt-8 flex flex-1 flex-col gap-4">
        {plan.items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-0 text-text-secondary">
            <Check size={16} className="mt-1 shrink-0 text-mare" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <Button
        href="#contato"
        variant={plan.highlighted ? 'primary' : 'ghost'}
        className="mt-10 w-full sm:w-auto"
      >
        Quero entender qual plano é ideal
      </Button>
    </div>
  );
}

/**
 * 07 — Planos de gestão.
 * Duas modalidades, lado a lado, seguidas de uma área menor e discreta de
 * serviços avulsos — sem transformar isso numa terceira coluna de preços.
 */
export function Plans() {
  const headingReveal = useScrollReveal();
  const addOnsReveal = useScrollReveal();

  return (
    <Section id="planos" bg="sand">
      <div ref={headingReveal} className="reveal section-heading--half">
        <Eyebrow>Planos de gestão</Eyebrow>
        <h2>Uma gestão que se adapta ao seu imóvel.</h2>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
        {plans.map((plan) => (
          <PlanColumn key={plan.id} plan={plan} />
        ))}
      </div>

      <div ref={addOnsReveal} className="reveal mt-16 border-t border-border pt-10">
        <h4 className="eyebrow eyebrow--muted">Personalize sua gestão</h4>
        <p className="max-w-[56ch] text-0 text-text-secondary">
          Alguns serviços podem ser contratados separadamente, independente do plano escolhido:
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {addOns.map((item) => (
            <li key={item} className="badge">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
