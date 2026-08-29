import { CalendarClock } from 'lucide-react';
import { Eyebrow } from '../ui/Eyebrow';
import { Button } from '../ui/Button';
import { WhatsAppLink } from '../ui/WhatsAppLink';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Section } from '../layout/Section';
import { CALENDLY_URL } from '../../config/contact';

/**
 * Painel de agendamento.
 *
 * INTEGRAÇÃO FUTURA: quando houver uma URL do Calendly (ou outra ferramenta
 * de agendamento), defina CALENDLY_URL em src/config/contact.js. Este
 * componente passa a renderizar o widget embutido automaticamente — nenhuma
 * outra alteração é necessária. Até lá, mostramos um estado visual claro,
 * sem simular uma integração que não existe.
 */
function SchedulingPanel() {
  if (CALENDLY_URL) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <iframe
          src={CALENDLY_URL}
          title="Agendar uma conversa com a Ubatuba Stay"
          className="h-[720px] w-full"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-6 rounded-lg border border-dashed border-border-strong bg-surface p-8 sm:p-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-aurora text-costa">
        <CalendarClock size={20} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-1 text-text">Agenda em breve disponível aqui</h3>
        <p className="mt-2 max-w-[42ch] text-0 text-text-secondary">
          Este espaço foi preparado para receber o widget do Calendly (ou outra ferramenta de
          agendamento) assim que a integração for configurada em{' '}
          <code className="rounded-xs bg-surface-sunken px-1.5 py-0.5 text-xs">
            src/config/contact.js
          </code>
          . Enquanto isso, fale com a gente diretamente pelo WhatsApp.
        </p>
      </div>
      <WhatsAppLink
        variant="primary"
        message="Olá! Quero agendar uma conversa sobre a gestão do meu imóvel em Ubatuba."
      >
        Chamar no WhatsApp
      </WhatsAppLink>
    </div>
  );
}

/**
 * 11 — Agendar uma conversa.
 * Encerramento forte, com tom de consultoria inicial — não de venda
 * agressiva.
 */
export function Contact() {
  const textReveal = useScrollReveal();
  const panelReveal = useScrollReveal();

  return (
    <Section id="contato" bg="sand">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div ref={textReveal} className="reveal">
          <Eyebrow>Agendar uma conversa</Eyebrow>
          <h2 className="max-w-[14ch]">Vamos conversar sobre o seu imóvel?</h2>
          <p className="mt-6 max-w-[46ch] text-1 text-text-secondary">
            Reserve uma conversa de até uma hora para conhecermos seu imóvel, entender seus
            objetivos e explicar como a Ubatuba Stay pode cuidar da operação.
          </p>
          <div className="mt-8">
            <Button href="#agendar" variant="primary">
              Agendar minha conversa
            </Button>
          </div>
        </div>

        <div ref={panelReveal} className="reveal" id="agendar">
          <SchedulingPanel />
        </div>
      </div>
    </Section>
  );
}
