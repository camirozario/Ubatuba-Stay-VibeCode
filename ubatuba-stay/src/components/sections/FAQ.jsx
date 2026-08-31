import { useState } from 'react';
import { faqItems } from '../../data/faq';
import { AccordionItem } from '../ui/AccordionItem';
import { Eyebrow } from '../ui/Eyebrow';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Section } from '../layout/Section';

/**
 * 10 — FAQ.
 * Accordion elegante e minimalista, uma pergunta aberta por vez.
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const headingReveal = useScrollReveal();
  const listReveal = useScrollReveal();

  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div ref={headingReveal} className="reveal">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <h2 className="section-title--column">Tire suas dúvidas antes de conversar com a gente.</h2>
        </div>

        <div ref={listReveal} className="reveal">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
