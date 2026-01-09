import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'w-full border-t',
      vertical: 'h-full border-l',
    },
    variant: {
      solid: 'border-neutral-200',
      dashed: 'border-neutral-200 border-dashed',
      dotted: 'border-neutral-200 border-dotted',
    },
    spacing: {
      none: '',
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-8',
    },
  },
  compoundVariants: [
    {
      orientation: 'vertical',
      spacing: 'sm',
      class: 'mx-2 my-0',
    },
    {
      orientation: 'vertical',
      spacing: 'md',
      class: 'mx-4 my-0',
    },
    {
      orientation: 'vertical',
      spacing: 'lg',
      class: 'mx-8 my-0',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
    spacing: 'md',
  },
});

/**
 * Divider component for visual separation
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'horizontal' | 'vertical'} [props.orientation]
 * @param {'solid' | 'dashed' | 'dotted'} [props.variant]
 * @param {'none' | 'sm' | 'md' | 'lg'} [props.spacing]
 * @param {string} [props.label]
 */
export function Divider({
  className,
  orientation,
  variant,
  spacing,
  label,
  ...props
}) {
  if (label && orientation !== 'vertical') {
    return (
      <div
        className={cn('flex items-center', spacing === 'sm' && 'my-2', spacing === 'md' && 'my-4', spacing === 'lg' && 'my-8', className)}
        role="separator"
        {...props}
      >
        <div className={cn('flex-1 border-t', variant === 'dashed' && 'border-dashed', variant === 'dotted' && 'border-dotted', 'border-neutral-200')} />
        <span className="px-3 text-sm text-neutral-500">{label}</span>
        <div className={cn('flex-1 border-t', variant === 'dashed' && 'border-dashed', variant === 'dotted' && 'border-dotted', 'border-neutral-200')} />
      </div>
    );
  }

  return (
    <hr
      className={cn(dividerVariants({ orientation, variant, spacing }), className)}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
}

export { dividerVariants };
