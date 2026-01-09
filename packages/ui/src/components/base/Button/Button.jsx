import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300',
        outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-50 active:bg-neutral-100',
        ghost: 'bg-transparent hover:bg-neutral-100 active:bg-neutral-200',
        danger: 'bg-error-500 text-white hover:bg-error-700 active:bg-error-700',
        link: 'bg-transparent text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-base gap-2',
        lg: 'h-12 px-6 text-lg gap-2.5',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * Button component with multiple variants and sizes
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'} [props.variant]
 * @param {'sm' | 'md' | 'lg' | 'icon'} [props.size]
 * @param {boolean} [props.disabled]
 * @param {'button' | 'submit' | 'reset'} [props.type]
 * @param {React.ReactNode} [props.children]
 * @param {React.Ref<HTMLButtonElement>} ref
 */
export const Button = forwardRef(function Button(
  { className, variant, size, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});

export { buttonVariants };
