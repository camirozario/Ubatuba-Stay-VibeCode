import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLockup } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { cn } from '../../utils/cn';

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#processo', label: 'Como funciona' },
  { href: '#planos', label: 'Planos' },
  { href: '#faq', label: 'Perguntas' },
];

export function Header({ brandTargetRef = null, brandVisible = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > window.innerHeight * 0.72);
        tickingRef.current = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const overImage = !scrolled;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-nav border-b transition-colors',
        overImage && !menuOpen
          ? 'nav--over-image border-border-inverse bg-transparent'
          : 'border-border bg-concha'
      )}
    >
      <Container className="flex h-full items-center justify-between gap-7">
        <a href="#topo" className="flex shrink-0 items-center" aria-label="Ubatuba Stay - início">
          <span
            className={cn(
              'inline-flex shrink-0 items-center transition-opacity duration-fast',
              brandVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
            <BrandLockup
              inverse={overImage && !menuOpen}
              className="gap-2 sm:gap-2.5"
              markClassName="w-[48px] sm:w-[52px]"
              wordmarkClassName="text-[0.7rem] sm:text-[0.76rem]"
              markRef={brandTargetRef}
            />
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={cn('nav__link', overImage && 'text-on-inverse')}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="#contato" variant={overImage ? 'secondary' : 'primary'} size="sm">
            Agendar uma conversa
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-pill border md:hidden',
            overImage && !menuOpen ? 'border-border-inverse text-on-inverse' : 'border-border-strong text-text'
          )}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border bg-concha px-gutter py-8 md:hidden">
          <nav className="flex flex-col gap-6" aria-label="Navegação móvel">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav__link text-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button href="#contato" variant="primary" onClick={() => setMenuOpen(false)}>
              Agendar uma conversa
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
