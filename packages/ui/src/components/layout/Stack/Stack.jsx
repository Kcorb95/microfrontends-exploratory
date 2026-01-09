import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const stackVariants = cva('flex', {
  variants: {
    direction: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
});

/**
 * Stack component for flexbox layouts
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'horizontal' | 'vertical'} [props.direction]
 * @param {'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} [props.gap]
 * @param {'start' | 'center' | 'end' | 'stretch' | 'baseline'} [props.align]
 * @param {'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'} [props.justify]
 * @param {boolean} [props.wrap]
 * @param {keyof JSX.IntrinsicElements} [props.as]
 * @param {React.ReactNode} [props.children]
 */
export function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  as: Component = 'div',
  children,
  ...props
}) {
  return (
    <Component
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Horizontal stack (shorthand for Stack with direction="horizontal")
 */
export function HStack(props) {
  return <Stack direction="horizontal" {...props} />;
}

/**
 * Vertical stack (shorthand for Stack with direction="vertical")
 */
export function VStack(props) {
  return <Stack direction="vertical" {...props} />;
}

export { stackVariants };
