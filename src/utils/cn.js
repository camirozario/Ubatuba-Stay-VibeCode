/**
 * Pequeno utilitário para concatenar classNames condicionalmente,
 * sem depender de uma lib externa (clsx/classnames) só para isso.
 */
export function cn(...args) {
  return args
    .flat()
    .filter(Boolean)
    .join(' ');
}
