import { testimonials } from '../../data/testimonials';
import { Eyebrow } from '../ui/Eyebrow';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Section } from '../layout/Section';

function TestimonialCard({ testimonial }) {
  const reveal = useScrollReveal();

  return (
    <figure ref={reveal} className="reveal border-t border-border pt-8">
      {testimonial.isPlaceholder && (
        <span className="badge mb-5 inline-block">Depoimento em breve</span>
      )}
      <blockquote className="quote m-0 max-w-[34ch]">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-11 w-11 rounded-pill object-cover"
          />
        )}
        <div>
          <p className="m-0 text-0 text-text">{testimonial.name}</p>
          <p className="m-0 text-xs tracking-nav text-text-tertiary">{testimonial.context}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * 08 — Experiências dos proprietários.
 * Seção enxuta: 2 a 4 depoimentos com destaque para texto e pessoa, sem
 * carrossel genérico. Conteúdo real ainda não fornecido — ver
 * src/data/testimonials.js para os placeholders identificados.
 */
export function Testimonials() {
  const headingReveal = useScrollReveal();

  return (
    <Section id="depoimentos">
      <div ref={headingReveal} className="reveal section-heading--half">
        <Eyebrow>Depoimentos</Eyebrow>
        <h2>A experiência de quem confia o imóvel à gente.</h2>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </Section>
  );
}
