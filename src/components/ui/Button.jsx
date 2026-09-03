import { cn } from '../../utils/cn';

const VARIANTS = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  ghost: 'btn--ghost',
  'ghost-inverse': 'btn--ghost-inverse',
};

/**
 * Botão único para todo o site, mapeado 1:1 nas classes .btn do design
 * system (pill, min-height 48px, tracking de botão). Renderiza <a> quando
 * `href` é passado, ou <button> caso contrário — nunca uma div clicável.
 */
export function Button({
  as,
  href,
  variant = 'primary',
  size,
  className = '',
  children,
  ...props
}) {
  const classes = cn('btn', VARIANTS[variant] ?? VARIANTS.primary, size === 'sm' && 'btn--sm', className);
  const Component = as || (href ? 'a' : 'button');

  if (Component === 'a') {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={props.type || 'button'} className={classes} {...props}>
      {children}
    </button>
  );
}
