import gestaoCoHostingImg from '../assets/images/services/gestao-cohosting.jpg';
import imagemApresentacaoImg from '../assets/images/services/imagem-apresentacao.jpg';
import operacaoExperienciaImg from '../assets/images/services/operacao-experiencia.jpg';
import preparacaoImovelImg from '../assets/images/services/preparacao-imovel.jpg';
import cozinhaMadeiraImg from '../assets/images/photography/cozinha-madeira.jpg';
import cozinhaJantarImg from '../assets/images/photography/cozinha-jantar.jpg';
import salaEntardecerImg from '../assets/images/photography/sala-entardecer.jpg';
import vistaMarImg from '../assets/images/photography/vista-mar.jpg';
import casaPiscinaImg from '../assets/images/photography/casa-piscina.jpg';
import casaPraiaImg from '../assets/images/photography/casa-praia.jpg';

/**
 * Banco central de imagens da landing page.
 *
 * PLACEHOLDER - as secoes que ainda nao receberam fotografia real seguem
 * apontando para o Lorem Picsum apenas para composicao visual temporaria.
 *
 * Para substituir por fotografia real:
 * 1. Coloque os arquivos em src/assets/images/
 * 2. Troque cada `url` abaixo por um `import` do arquivo local
 * 3. Mantenha os campos `alt` para acessibilidade e SEO
 *
 * O parametro `seed` garante que a mesma imagem apareca de forma consistente
 * a cada carregamento.
 */

const picsum = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const PLACEHOLDER = true;

export const heroImage = {
  src: picsum('ubatuba-hero-facade', 1800, 2200),
  alt: 'PLACEHOLDER - fachada de um imovel administrado pela Ubatuba Stay, ao entardecer.',
};

export const philosophyImage = {
  src: picsum('ubatuba-arquitetura', 1400, 1750),
  alt: 'PLACEHOLDER - detalhe arquitetonico de um imovel administrado pela Ubatuba Stay.',
};

export const serviceImages = {
  gestao: {
    src: gestaoCoHostingImg,
    alt: 'Profissional em mesa de trabalho analisando relatorios e gestao operacional.',
  },
  preparacao: {
    src: preparacaoImovelImg,
    alt: 'Profissional registrando detalhes do imovel durante a preparacao inicial.',
  },
  operacao: {
    src: operacaoExperienciaImg,
    alt: 'Quarto preparado para receber hospedes, com cama posta e toalhas organizadas.',
  },
  imagem: {
    src: imagemApresentacaoImg,
    alt: 'Camera fotografica profissional posicionada para registrar o imovel.',
  },
};

/** Galeria de fotografia - usada na secao 04, com scroll horizontal. */
export const galleryImages = [
  { src: cozinhaMadeiraImg, alt: 'Cozinha ampla com marcenaria em madeira e ilha central.' },
  { src: cozinhaJantarImg, alt: 'Cozinha integrada a sala de jantar, preparada para receber.' },
  { src: salaEntardecerImg, alt: 'Sala de estar iluminada pelo sol do fim de tarde.' },
  { src: vistaMarImg, alt: 'Vista para o mar atravessando arcos de uma casa costeira.' },
  { src: casaPiscinaImg, alt: 'Casa de temporada com piscina e area externa arborizada.' },
  { src: casaPraiaImg, alt: 'Casa contemporanea de frente para a praia.' },
];

export const processImage = {
  src: picsum('ubatuba-processo', 1400, 1900),
  alt: 'PLACEHOLDER - equipe da Ubatuba Stay durante visita tecnica a um imovel.',
};

export const testimonialsSectionImage = {
  src: picsum('ubatuba-depoimentos', 1200, 1500),
  alt: 'PLACEHOLDER - imovel administrado pela Ubatuba Stay, fachada lateral.',
};
