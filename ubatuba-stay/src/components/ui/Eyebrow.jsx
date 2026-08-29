import { cn } from '../../utils/cn';

export function Eyebrow({ children, inverse = false, muted = false, as: Component = 'p', className = '' }) {
  return (
    <Component
      className={cn('eyebrow', inverse && 'eyebrow--inverse', muted && 'eyebrow--muted', className)}
    >
      {children}
    </Component>
  );
}
