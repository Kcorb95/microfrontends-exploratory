import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const toolbarVariants = cva(
  'flex items-center',
  {
    variants: {
      variant: {
        default: 'bg-white border border-neutral-200 rounded-lg shadow-sm',
        floating: 'bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-full shadow-lg',
        transparent: 'bg-transparent',
      },
      size: {
        sm: 'gap-1 p-1',
        md: 'gap-2 p-2',
        lg: 'gap-3 p-3',
      },
      position: {
        static: '',
        fixed: 'fixed',
        sticky: 'sticky',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      position: 'static',
    },
  }
);

/**
 * Toolbar container component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'default' | 'floating' | 'transparent'} [props.variant]
 * @param {'sm' | 'md' | 'lg'} [props.size]
 * @param {'static' | 'fixed' | 'sticky'} [props.position]
 * @param {React.ReactNode} [props.children]
 */
export function Toolbar({
  className,
  variant,
  size,
  position,
  children,
  ...props
}) {
  return (
    <div
      role="toolbar"
      className={cn(toolbarVariants({ variant, size, position }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Toolbar button component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {boolean} [props.active]
 * @param {boolean} [props.disabled]
 * @param {React.ReactNode} [props.children]
 */
export function ToolbarButton({
  className,
  active,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 text-neutral-700 transition-colors',
        'hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
        'disabled:opacity-50 disabled:pointer-events-none',
        active && 'bg-neutral-100 text-primary-600',
        className
      )}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Toolbar separator component
 * @param {Object} props
 * @param {string} [props.className]
 */
export function ToolbarSeparator({ className, ...props }) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={cn('h-6 w-px bg-neutral-200', className)}
      {...props}
    />
  );
}

/**
 * Toolbar group component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export function ToolbarGroup({ className, children, ...props }) {
  return (
    <div
      role="group"
      className={cn('flex items-center gap-0.5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { toolbarVariants };
