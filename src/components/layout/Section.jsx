import { cn } from '../../utils/cn';
import { Container } from './Container';

const BG = {
  cream: '',
  sand: 'section--sand',
  inverse: 'section--inverse',
};

/**
 * Wrapper de seção compartilhado — cuida do ritmo vertical (--section-y),
 * da alternância cream/sand/inverse e do container. `id` habilita a
 * navegação por âncora do header.
 */
export function Section({
  id,
  bg = 'cream',
  className = '',
  containerClassName = '',
  children,
  as: Component = 'section',
  scrollMode = 'snap',
}) {
  return (
    <Component
      id={id}
      data-section-scroll-mode={scrollMode}
      className={cn('section story-deck__panel', BG[bg], className)}
    >
      <Container className={cn('story-deck__surface', containerClassName)}>{children}</Container>
    </Component>
  );
}
