/**
 * Planos de gestão — conteúdo literal do briefing.
 * Propositalmente apenas duas modalidades principais.
 */
export const plans = [
  {
    id: 'essencial',
    name: 'Gestão Essencial',
    tagline: 'Para proprietários que precisam principalmente da gestão digital da hospedagem.',
    items: [
      'Gestão das reservas',
      'Comunicação com hóspedes',
      'Calendário',
      'Estratégia de preços',
      'Gestão dos anúncios',
      'Acesso à plataforma do proprietário',
    ],
    highlighted: false,
  },
  {
    id: 'completa',
    name: 'Gestão Completa',
    tagline:
      'Para proprietários que desejam delegar também a operação cotidiana da hospedagem.',
    items: [
      'Tudo o que está na Gestão Essencial',
      'Coordenação de check-in e check-out',
      'Coordenação da limpeza',
      'Acompanhamento contínuo do imóvel',
      'Indicação de profissionais de confiança',
    ],
    highlighted: true,
  },
];

/** Serviços adicionais — contratáveis separadamente. */
export const addOns = [
  'Fotografia profissional',
  'Roupa de cama e banho',
  'Preparação inicial do imóvel',
  'Inventário',
  'Visitas adicionais',
  'Outros serviços operacionais',
];
