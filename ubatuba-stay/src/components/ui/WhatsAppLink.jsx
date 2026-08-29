import { buildWhatsAppLink } from '../../config/contact';
import { Button } from './Button';

/**
 * CTA de WhatsApp. Se WHATSAPP_NUMBER ainda não foi configurado
 * (src/config/contact.js), o botão fica desabilitado com um aria-label
 * explicativo em vez de apontar para um link quebrado ou inventado.
 */
export function WhatsAppLink({ message, variant = 'ghost', size, className, children = 'Falar no WhatsApp' }) {
  const link = buildWhatsAppLink(message);

  if (!link) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
        aria-disabled="true"
        title="Configure WHATSAPP_NUMBER em src/config/contact.js"
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      as="a"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}
