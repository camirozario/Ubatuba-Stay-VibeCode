import { cn } from '../../utils/cn';

/**
 * Wrapper de imagem único do site. `priority` desliga o lazy-load e a
 * decodificação assíncrona para a imagem LCP (o hero) — nunca aplicar
 * lazy-loading nela, conforme o briefing. `arch` aplica o motivo de forma
 * recorrente do design system (--r-arch); use em no máximo uma imagem de
 * destaque por tela, nunca em grades de thumbnails.
 */
export function Media({
  image,
  arch = false,
  priority = false,
  className = '',
  imgClassName = '',
  aspect,
  sizes,
}) {
  if (!image) return null;

  return (
    <div
      className={cn('relative overflow-hidden', arch ? 'media-arch' : 'rounded-md', className)}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        sizes={sizes}
        className={cn('h-full w-full object-cover block', imgClassName)}
      />
    </div>
  );
}
