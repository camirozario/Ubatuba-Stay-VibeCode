# Ubatuba Stay — Landing Page

Landing page em React + Vite + Tailwind CSS para a Ubatuba Stay, gestão de imóveis por
temporada e co-hosting em Ubatuba/SP. Construída em cima do Design System fornecido
(`ubatuba-stay-tokens.css`), sem introduzir cores, fontes ou espaçamentos novos.

## Rodando o projeto

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Stack

React 18 + Vite + JavaScript (sem TypeScript, sem Next.js) + Tailwind CSS + GSAP/ScrollTrigger
para as animações de scroll mais elaboradas (parallax do hero, galeria horizontal fixada,
reveal do mockup da plataforma). Ícones: `lucide-react`. Sem Lenis — o scroll nativo com
`scroll-behavior: smooth` já atende bem, e menos uma dependência é menos superfície de bug.

## O que ainda precisa ser substituído antes de publicar

Tudo abaixo está claramente sinalizado no código (comentários `PLACEHOLDER` / `TODO`):

1. **Fotografias reais** — `src/data/images.js`. Hoje usa imagens do Lorem Picsum (banco de
   imagens público, só para preencher o layout com proporções e qualidade corretas). Troque
   cada `src` por um `import` de arquivo em `src/assets/images/` quando as fotos da Ubatuba
   Stay estiverem disponíveis. Os textos `alt` já descrevem o que cada imagem deveria mostrar.
2. **Depoimentos** — `src/data/testimonials.js`. Três placeholders estruturais (não são
   depoimentos reais — não invente nomes, textos ou avaliações). Substitua pelo conteúdo real,
   com autorização do proprietário, e remova `isPlaceholder`.
3. **WhatsApp** — `src/config/contact.js`, constante `WHATSAPP_NUMBER`. Enquanto vazia, os
   botões de WhatsApp ficam desabilitados (em vez de apontar para um link quebrado).
4. **Agendamento (Calendly ou similar)** — `src/config/contact.js`, constante `CALENDLY_URL`.
   Enquanto vazia, a seção de contato mostra um estado visual preparado para a integração, sem
   simular um agendamento que não existe. Ao preencher a URL, o widget passa a ser renderizado
   automaticamente em `src/components/sections/Contact.jsx`.
5. **Instagram / e-mail** — também em `src/config/contact.js`.
6. **Mockup da plataforma do proprietário** — `src/components/sections/OwnerPlatform.jsx`
   contém um mockup construído em HTML/CSS (não é uma captura de tela real), representando de
   forma abstrata calendário, reservas e indicadores. Substitua pelo componente
   `PlatformMockup` por capturas de tela reais da plataforma quando disponíveis.
7. **SEO** — `index.html`: preencha `og:image` (1200×630) com uma imagem real e confirme a URL
   canônica quando o domínio definitivo estiver definido.
8. **Favicon** — `public/favicon.svg` usa o mark (linha + círculo coral) extraído do Design
   System. Se houver uma versão oficial do símbolo em SVG, substitua este arquivo.

## Estrutura

```
src/
├── assets/            # imagens, ícones e logo locais (vazio até a fotografia real entrar)
├── components/
│   ├── layout/         # Header, Footer, Container, Section
│   ├── ui/              # Button, Eyebrow, Logo, Media, AccordionItem, WhatsAppLink…
│   └── sections/        # uma seção da landing page por arquivo (Hero, Services, FAQ…)
├── config/
│   └── contact.js       # WHATSAPP_NUMBER, CALENDLY_URL, Instagram, e-mail
├── data/                # conteúdo estruturado: services, plans, testimonials, faq, process, images
├── hooks/               # usePrefersReducedMotion, useScrollReveal
├── utils/               # cn (classnames), gsapSetup (registro único do ScrollTrigger)
├── App.jsx
├── main.jsx
└── index.css            # tokens do Design System (:root) + classes base (.btn, .eyebrow…)
```

## Sobre o Design System

`tailwind.config.js` não define cores/tipografia/espaçamento com valores próprios — ele aponta
cada token para a variável CSS correspondente definida em `src/index.css` (ex.:
`colors.costa: 'var(--ub-costa)'`). Isso significa que **a fonte de verdade é sempre
`src/index.css`**; para ajustar uma cor ou espaçamento em todo o site, o ajuste é feito lá, uma
única vez.

Componentes de baixo nível do Design System (botões, badges, campos de formulário, linhas de
especificação, navegação, accordion) foram portados como classes utilitárias em
`@layer components` dentro de `src/index.css`, para poder reutilizar exatamente as mesmas
classes (`.btn--primary`, `.eyebrow`, `.spec-row`, `.numeral`, `.quote`…) descritas no Design
System, junto com o Tailwind para layout e composição.

## Motion

Todas as animações de scroll mais elaboradas (parallax do hero, reveal em estágios na entrada,
galeria horizontal fixada, reveal do mockup da plataforma) usam GSAP + ScrollTrigger, isoladas
em cada seção. Microinterações simples (hover, underline, transições de cor/opacidade) usam
apenas CSS/Tailwind. Tudo respeita `prefers-reduced-motion`: as durações de transição caem para
`0ms` via CSS (`src/index.css`) e as animações GSAP são puladas nos componentes que as usam
(`Hero`, `Photography`, `OwnerPlatform`) checando o hook `usePrefersReducedMotion` / helper
`prefersReducedMotion()`.

## Nota sobre este ambiente de desenvolvimento

Este projeto foi escrito e revisado de forma que `npm install && npm run dev` funcione
normalmente na sua máquina. A verificação de sintaxe e de montagem em tempo de execução (React
renderizando sem erros, todas as 11 seções presentes, accordion, menu mobile e header
respondendo a interação) foi feita com `esbuild` e Playwright localmente, simulando `gsap` e
`lucide-react`; não foi possível rodar `npm install` real dentro do ambiente de geração deste
código por restrição de rede do sandbox — isso não afeta a instalação normal no seu computador.
