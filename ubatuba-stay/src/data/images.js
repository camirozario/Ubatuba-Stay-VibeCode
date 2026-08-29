/**
 * Banco central de imagens da landing page.
 *
 * PLACEHOLDER — nenhuma fotografia real da Ubatuba Stay foi fornecida neste
 * briefing. Todas as URLs abaixo apontam para o Lorem Picsum (serviço público
 * de imagens de banco, gratuito, estável), usadas apenas para compor o
 * layout com fotografias de qualidade e proporção corretas.
 *
 * Para substituir por fotografia real:
 * 1. Coloque os arquivos em src/assets/images/ (ex.: hero.jpg, philosophy.jpg…)
 * 2. Troque cada `url` abaixo por um `import` do arquivo local
 *    (ex.: import heroImg from '../assets/images/hero.jpg')
 * 3. Mantenha os campos `alt` — foram escritos para descrever o conteúdo
 *    real esperado de cada imagem e são importantes para acessibilidade e SEO.
 *
 * O parâmetro `seed` garante que a mesma imagem apareça de forma consistente
 * a cada carregamento (o Picsum é determinístico por seed).
 */

const picsum = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const PLACEHOLDER = true;

export const heroImage = {
  src: picsum('ubatuba-hero-facade', 1800, 2200),
  alt: 'PLACEHOLDER — fachada de um imóvel administrado pela Ubatuba Stay, ao entardecer.',
};

export const philosophyImage = {
  src: picsum('ubatuba-arquitetura', 1400, 1750),
  alt: 'PLACEHOLDER — detalhe arquitetônico de um imóvel administrado pela Ubatuba Stay.',
};

export const serviceImages = {
  gestao: {
    src: picsum('ubatuba-gestao', 1200, 1500),
    alt: 'PLACEHOLDER — mesa de trabalho com calendário de reservas organizado.',
  },
  preparacao: {
    src: picsum('ubatuba-preparacao', 1200, 1500),
    alt: 'PLACEHOLDER — interior preparado e organizado antes de receber hóspedes.',
  },
  operacao: {
    src: picsum('ubatuba-operacao', 1200, 1500),
    alt: 'PLACEHOLDER — enxoval de cama e banho organizado para check-in.',
  },
  imagem: {
    src: picsum('ubatuba-fotografia-servico', 1200, 1500),
    alt: 'PLACEHOLDER — câmera fotográfica profissional preparada para uma sessão no imóvel.',
  },
};

/** Galeria de fotografia — usada na seção 04, com scroll horizontal. */
export const galleryImages = [
  { src: picsum('ubatuba-galeria-1', 1600, 1100), alt: 'PLACEHOLDER — sala de estar com vista para o mar.' },
  { src: picsum('ubatuba-galeria-2', 1600, 1100), alt: 'PLACEHOLDER — suíte com luz natural ao amanhecer.' },
  { src: picsum('ubatuba-galeria-3', 1600, 1100), alt: 'PLACEHOLDER — varanda com rede e vegetação nativa.' },
  { src: picsum('ubatuba-galeria-4', 1600, 1100), alt: 'PLACEHOLDER — piscina do imóvel ao entardecer.' },
  { src: picsum('ubatuba-galeria-5', 1600, 1100), alt: 'PLACEHOLDER — cozinha integrada, estilo editorial.' },
  { src: picsum('ubatuba-galeria-6', 1600, 1100), alt: 'PLACEHOLDER — detalhe de acabamento em madeira e pedra.' },
];

export const processImage = {
  src: picsum('ubatuba-processo', 1400, 1900),
  alt: 'PLACEHOLDER — equipe da Ubatuba Stay durante visita técnica a um imóvel.',
};

export const testimonialsSectionImage = {
  src: picsum('ubatuba-depoimentos', 1200, 1500),
  alt: 'PLACEHOLDER — imóvel administrado pela Ubatuba Stay, fachada lateral.',
};
