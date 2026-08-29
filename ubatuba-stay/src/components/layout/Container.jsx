import { cn } from '../../utils/cn';

export function Container({ children, className = '' }) {
  return <div className={cn('mx-auto w-full max-w-container px-gutter', className)}>{children}</div>;
}
