import { Instagram } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Container } from './Container';
import { WhatsAppLink } from '../ui/WhatsAppLink';
import { INSTAGRAM_URL, LOCATION_LABEL, CONTACT_EMAIL } from '../../config/contact';

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#processo', label: 'Como funciona' },
  { href: '#planos', label: 'Planos' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#faq', label: 'Perguntas' },
  { href: '#contato', label: 'Agendar uma conversa' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section--inverse pt-16 pb-10">
      <Container>
        <div className="grid gap-12 border-b border-border-inverse pb-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <a href="#topo" className="mb-5 flex items-center gap-3" aria-label="Ubatuba Stay — início">
              <Logo inverse />
              <span className="text-[12px] tracking-nav text-on-inverse">UBATUBA STAY</span>
            </a>
            <p className="max-w-[36ch] text-0 text-inverse-secondary">
              Gestão de hospedagens e co-hosting para imóveis por temporada em Ubatuba — da
              apresentação à operação, com transparência para o proprietário.
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="eyebrow eyebrow--inverse">Navegação</h2>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-0 text-inverse-link transition-colors hover:text-inverse">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow eyebrow--inverse">Contato</h2>
            <ul className="flex flex-col gap-3 text-0 text-inverse-link">
              <li>{LOCATION_LABEL}</li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-inverse">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-inverse"
                >
                  <Instagram size={16} aria-hidden="true" />
                  Instagram
                </a>
              </li>
              <li>
                <WhatsAppLink variant="ghost-inverse" size="sm" className="mt-1">
                  WhatsApp
                </WhatsAppLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-xs text-inverse-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">© {year} Ubatuba Stay. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="/politica-de-privacidade" className="hover:text-inverse">
              Política de privacidade
            </a>
            <a href="/termos" className="hover:text-inverse">
              Termos
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
