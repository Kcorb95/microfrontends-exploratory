import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const cardVariants = cva(
  'rounded-lg border bg-white transition-shadow',
  {
    variants: {
      variant: {
        default: 'border-neutral-200',
        outline: 'border-neutral-300',
        elevated: 'border-transparent shadow-md hover:shadow-lg',
        ghost: 'border-transparent bg-transparent',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

/**
 * Card component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'default' | 'outline' | 'elevated' | 'ghost'} [props.variant]
 * @param {'none' | 'sm' | 'md' | 'lg'} [props.padding]
 * @param {keyof JSX.IntrinsicElements} [props.as]
 * @param {React.ReactNode} [props.children]
 */
export function Card({
  className,
  variant,
  padding,
  as: Component = 'div',
  children,
  ...props
}) {
  return (
    <Component
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Card header component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card title component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {keyof JSX.IntrinsicElements} [props.as]
 * @param {React.ReactNode} [props.children]
 */
export function CardTitle({ className, as: Component = 'h3', children, ...props }) {
  return (
    <Component
      className={cn('text-lg font-semibold text-neutral-900', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Card description component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('mt-1 text-sm text-neutral-500', className)} {...props}>
      {children}
    </p>
  );
}

/**
 * Card content component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card footer component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('mt-4 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
}

export { cardVariants };
