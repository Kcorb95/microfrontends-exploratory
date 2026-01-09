import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const selectVariants = cva(
  'flex w-full rounded-md border bg-white px-3 py-2 text-base transition-colors appearance-none bg-no-repeat focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 hover:border-neutral-400',
        error: 'border-error-500 focus:ring-error-500',
      },
      selectSize: {
        sm: 'h-8 text-sm pr-8',
        md: 'h-10 text-base pr-10',
        lg: 'h-12 text-lg pr-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'md',
    },
  }
);

/**
 * Select component with variants
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'default' | 'error'} [props.variant]
 * @param {'sm' | 'md' | 'lg'} [props.selectSize]
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.placeholder]
 * @param {Array<{value: string, label: string, disabled?: boolean}>} [props.options]
 * @param {React.ReactNode} [props.children]
 * @param {React.Ref<HTMLSelectElement>} ref
 */
export const Select = forwardRef(function Select(
  { className, variant, selectSize, label, error, placeholder, options, children, id, ...props },
  ref
) {
  const selectId = id || props.name;
  const actualVariant = error ? 'error' : variant;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(selectVariants({ variant: actualVariant, selectSize }), className)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-error-500">
          {error}
        </p>
      )}
    </div>
  );
});

export { selectVariants };
