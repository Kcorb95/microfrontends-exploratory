import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const sectionVariants = cva('', {
  variants: {
    padding: {
      none: 'py-0',
      sm: 'py-8 md:py-12',
      md: 'py-12 md:py-16',
      lg: 'py-16 md:py-24',
      xl: 'py-24 md:py-32',
    },
    background: {
      transparent: 'bg-transparent',
      white: 'bg-white',
      light: 'bg-neutral-50',
      dark: 'bg-neutral-900 text-white',
      primary: 'bg-primary-600 text-white',
      gradient: 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white',
    },
  },
  defaultVariants: {
    padding: 'md',
    background: 'transparent',
  },
});

/**
 * Section component for page sections
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'none' | 'sm' | 'md' | 'lg' | 'xl'} [props.padding]
 * @param {'transparent' | 'white' | 'light' | 'dark' | 'primary' | 'gradient'} [props.background]
 * @param {string} [props.id]
 * @param {React.ReactNode} [props.children]
 */
export function Section({
  className,
  padding,
  background,
  children,
  ...props
}) {
  return (
    <section
      className={cn(sectionVariants({ padding, background }), className)}
      {...props}
    >
      {children}
    </section>
  );
}

export { sectionVariants };
