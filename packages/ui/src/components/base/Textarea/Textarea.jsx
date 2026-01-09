import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const textareaVariants = cva(
  'flex w-full rounded-md border bg-white px-3 py-2 text-base transition-colors placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 hover:border-neutral-400',
        error: 'border-error-500 focus:ring-error-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Textarea component with variants
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'default' | 'error'} [props.variant]
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.hint]
 * @param {number} [props.rows]
 * @param {React.Ref<HTMLTextAreaElement>} ref
 */
export const Textarea = forwardRef(function Textarea(
  { className, variant, label, error, hint, rows = 4, id, ...props },
  ref
) {
  const textareaId = id || props.name;
  const actualVariant = error ? 'error' : variant;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(textareaVariants({ variant: actualVariant }), className)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="text-sm text-error-500">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${textareaId}-hint`} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export { textareaVariants };
