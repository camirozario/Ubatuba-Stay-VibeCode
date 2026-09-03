import { useId, useRef } from 'react';

/**
 * Item de accordion acessível para o FAQ. Usa grid-template-rows 0fr→1fr
 * para animar a abertura sem media queries de altura fixa nem JS medindo
 * scrollHeight — evita layout shift e funciona com conteúdo de tamanho
 * variável. Anima apenas grid-template-rows + opacity (nunca height).
 */
export function AccordionItem({ question, answer, isOpen, onToggle }) {
  const panelId = useId();
  const buttonId = useId();
  const contentRef = useRef(null);

  return (
    <div className="border-b border-border">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="text-1 font-normal text-text">{question}</span>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-border-strong text-text transition-transform"
            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" fill="none" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-slow"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p
            ref={contentRef}
            className="max-w-measure pb-6 pr-12 text-0 text-text-secondary"
            style={{ opacity: isOpen ? 1 : 0, transition: 'opacity var(--dur-slow) var(--ease)' }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
