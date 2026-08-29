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
export function Section({ id, bg = 'cream', className = '', containerClassName = '', children, as: Component = 'section' }) {
  return (
    <Component id={id} className={cn('section', BG[bg], className)}>
      <Container className={containerClassName}>{children}</Container>
    </Component>
  );
}
