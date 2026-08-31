import { serviceImages } from './images';

/**
 * Serviços — conteúdo extraído literalmente do briefing.
 * Renderizado de forma editorial (números + tipografia), não como cards.
 */
export const services = [
  {
    number: '01',
    title: 'Preparação do imóvel',
    description:
      'Antes de receber o primeiro hóspede, entendemos o imóvel a fundo — espaços, equipamentos e particularidades — para montar uma base sólida de operação.',
    image: serviceImages.preparacao,
    items: [
      'Visita inicial',
      'Avaliação operacional',
      'Inventário completo do imóvel',
      'Identificação de possíveis melhorias',
      'Organização das informações e regras',
      'Preparação para receber hóspedes',
    ],
  },
  {
    number: '02',
    title: 'Imagem & Apresentação',
    description:
      'A primeira impressão do imóvel acontece na tela do hóspede, antes mesmo da reserva — e é ela que constrói confiança.',
    image: serviceImages.imagem,
    items: [
      'Fotografia profissional',
      'Preparação visual do imóvel',
      'Seleção e organização das fotografias',
      'Criação ou otimização dos anúncios',
    ],
  },
  {
    number: '03',
    title: 'Gestão & Co-hosting',
    description:
      'A operação digital da hospedagem, do primeiro contato do hóspede ao check-out, sempre alinhada com o que foi combinado com o proprietário.',
    image: serviceImages.gestao,
    items: [
      'Comunicação com hóspedes',
      'Gestão de reservas',
      'Organização do calendário',
      'Estratégia de preços e disponibilidade',
      'Gestão do anúncio no Airbnb',
      'Gestão no Booking quando aplicável',
      'Acompanhamento da operação',
    ],
  },
  {
    number: '04',
    title: 'Operação & Experiência',
    description:
      'O que garante que cada estadia funcione bem no dia a dia — para o hóspede e para o imóvel.',
    image: serviceImages.operacao,
    items: [
      'Organização de check-in e check-out',
      'Suporte ao hóspede',
      'Coordenação da limpeza',
      'Indicação e coordenação de profissionais de confiança',
      'Serviço de roupa de cama e banho quando contratado',
      'Acompanhamento do imóvel',
    ],
  },
];
