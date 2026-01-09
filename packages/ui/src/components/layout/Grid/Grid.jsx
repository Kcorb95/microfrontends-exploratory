import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-12',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
    align: 'stretch',
    justify: 'stretch',
  },
});

/**
 * Grid component for CSS Grid layouts
 * @param {Object} props
 * @param {string} [props.className]
 * @param {1 | 2 | 3 | 4 | 5 | 6 | 12} [props.cols]
 * @param {'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'} [props.gap]
 * @param {'start' | 'center' | 'end' | 'stretch'} [props.align]
 * @param {'start' | 'center' | 'end' | 'stretch'} [props.justify]
 * @param {keyof JSX.IntrinsicElements} [props.as]
 * @param {React.ReactNode} [props.children]
 */
export function Grid({
  className,
  cols,
  gap,
  align,
  justify,
  as: Component = 'div',
  children,
  ...props
}) {
  return (
    <Component
      className={cn(gridVariants({ cols, gap, align, justify }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Grid item component for spanning columns
 * @param {Object} props
 * @param {string} [props.className]
 * @param {number} [props.span]
 * @param {number} [props.start]
 * @param {keyof JSX.IntrinsicElements} [props.as]
 * @param {React.ReactNode} [props.children]
 */
export function GridItem({
  className,
  span,
  start,
  as: Component = 'div',
  children,
  ...props
}) {
  const spanClass = span ? `col-span-${span}` : '';
  const startClass = start ? `col-start-${start}` : '';

  return (
    <Component className={cn(spanClass, startClass, className)} {...props}>
      {children}
    </Component>
  );
}

export { gridVariants };
