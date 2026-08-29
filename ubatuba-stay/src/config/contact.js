/**
 * Configuração central de contato.
 *
 * IMPORTANTE — substitua os valores abaixo antes de publicar:
 * - WHATSAPP_NUMBER: número no formato internacional, apenas dígitos
 *   (código do país + DDD + número). Ex.: "5512988887777".
 * - CALENDLY_URL: link do Calendly (ou outra ferramenta de agendamento)
 *   usado para embutir o widget na seção de contato. Enquanto não houver
 *   um link real, o componente de agendamento mostra um estado visual
 *   preparado para a integração, sem simular uma URL falsa.
 * - INSTAGRAM_URL / EMAIL: usados no rodapé e nos CTAs secundários.
 */

export const WHATSAPP_NUMBER = ''; // TODO: preencher, ex. "5512988887777"

export const CALENDLY_URL = ''; // TODO: preencher, ex. "https://calendly.com/ubatuba-stay/conversa"

export const INSTAGRAM_URL = 'https://instagram.com/ubatubastay'; // TODO: confirmar handle

export const CONTACT_EMAIL = 'contato@ubatubastay.com.br'; // TODO: confirmar e-mail

export const LOCATION_LABEL = 'Ubatuba — SP';

/**
 * Monta um link do WhatsApp (wa.me) com mensagem pré-preenchida.
 * Retorna null quando nenhum número foi configurado ainda, para que a UI
 * possa degradar graciosamente (desabilitar o botão / avisar) em vez de
 * apontar para um link quebrado.
 */
export function buildWhatsAppLink(message = 'Olá! Gostaria de saber mais sobre a gestão da Ubatuba Stay.') {
  if (!WHATSAPP_NUMBER) return null;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
