import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-screen-sm', // 640px
      md: 'max-w-screen-md', // 768px
      lg: 'max-w-screen-lg', // 1024px
      xl: 'max-w-screen-xl', // 1280px
      '2xl': 'max-w-screen-2xl', // 1536px
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});

/**
 * Container component for max-width content
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'} [props.size]
 * @param {keyof JSX.IntrinsicElements} [props.as]
 * @param {React.ReactNode} [props.children]
 */
export function Container({
  className,
  size,
  as: Component = 'div',
  children,
  ...props
}) {
  return (
    <Component className={cn(containerVariants({ size }), className)} {...props}>
      {children}
    </Component>
  );
}

export { containerVariants };
