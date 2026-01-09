import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';
import { Container } from '../../layout/Container/Container.jsx';

const heroVariants = cva('relative overflow-hidden', {
  variants: {
    size: {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-24 md:py-32',
      xl: 'py-32 md:py-48',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    background: {
      none: '',
      light: 'bg-neutral-50',
      dark: 'bg-neutral-900 text-white',
      primary: 'bg-primary-600 text-white',
      gradient: 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    align: 'center',
    background: 'none',
  },
});

/**
 * Hero section component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size]
 * @param {'left' | 'center' | 'right'} [props.align]
 * @param {'none' | 'light' | 'dark' | 'primary' | 'gradient'} [props.background]
 * @param {string} [props.eyebrow]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.actions]
 * @param {React.ReactNode} [props.media]
 * @param {React.ReactNode} [props.children]
 */
export function Hero({
  className,
  size,
  align,
  background,
  eyebrow,
  title,
  description,
  actions,
  media,
  children,
  ...props
}) {
  const isDark = background === 'dark' || background === 'primary' || background === 'gradient';

  return (
    <section
      className={cn(heroVariants({ size, align, background }), className)}
      {...props}
    >
      <Container>
        <div className={cn('relative z-10', align === 'center' && 'mx-auto max-w-3xl')}>
          {eyebrow && (
            <p
              className={cn(
                'mb-4 text-sm font-semibold uppercase tracking-wider',
                isDark ? 'text-white/80' : 'text-primary-600'
              )}
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h1
              className={cn(
                'text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl',
                isDark ? 'text-white' : 'text-neutral-900'
              )}
            >
              {title}
            </h1>
          )}
          {description && (
            <p
              className={cn(
                'mt-6 text-lg md:text-xl',
                isDark ? 'text-white/90' : 'text-neutral-600'
              )}
            >
              {description}
            </p>
          )}
          {actions && (
            <div
              className={cn(
                'mt-8 flex gap-4',
                align === 'center' && 'justify-center',
                align === 'right' && 'justify-end'
              )}
            >
              {actions}
            </div>
          )}
          {children}
        </div>
        {media && (
          <div className="mt-12">
            {media}
          </div>
        )}
      </Container>
    </section>
  );
}

export { heroVariants };
