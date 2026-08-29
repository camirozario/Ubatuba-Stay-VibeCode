import { services } from '../../data/services';
import { Eyebrow } from '../ui/Eyebrow';
import { Media } from '../ui/Media';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Section } from '../layout/Section';
import { cn } from '../../utils/cn';

function ServiceRow({ service, index }) {
  const reveal = useScrollReveal();
  const reversed = index % 2 === 1;

  return (
    <div
      ref={reveal}
      className={cn(
        'reveal grid items-start gap-10 border-t border-border py-14 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-8'
      )}
    >
      <div className={cn('lg:col-span-5', reversed && 'lg:order-2')}>
        <Media image={service.image} aspect="4 / 3" />
      </div>

      <div className={cn('lg:col-span-7', reversed && 'lg:order-1')}>
        <div className="flex items-baseline gap-5">
          <span className="numeral">{service.number}</span>
          <h3 className="text-3 font-light text-text">{service.title}</h3>
        </div>
        <p className="mt-4 max-w-[54ch] text-1 text-text-secondary">{service.description}</p>

        <ul className="mt-8 columns-1 gap-x-10 sm:columns-2">
          {service.items.map((item) => (
            <li
              key={item}
              className="mb-3 flex items-start gap-3 break-inside-avoid text-0 text-text-secondary"
            >
              <span aria-hidden="true" className="mt-[11px] h-px w-2 shrink-0 bg-mare" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * 03 — Serviços.
 * Sequência editorial numerada (não uma grade de 4 cards): fotografia,
 * numeral serifado, título, descrição e lista corrida, alternando o lado
 * da imagem a cada item para quebrar a repetição visual.
 */
export function Services() {
  const headingReveal = useScrollReveal();

  return (
    <Section id="servicos">
      <div ref={headingReveal} className="reveal max-w-[26ch]">
        <Eyebrow>Serviços</Eyebrow>
        <h2>Tudo o que acontece por trás de uma boa estadia.</h2>
      </div>

      <div className="mt-12">
        {services.map((service, index) => (
          <ServiceRow key={service.number} service={service} index={index} />
        ))}
      </div>
    </Section>
  );
}
