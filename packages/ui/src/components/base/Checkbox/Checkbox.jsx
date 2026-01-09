import { forwardRef } from 'react';
import { cn } from '@repo/utils';

/**
 * Checkbox component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.label]
 * @param {string} [props.description]
 * @param {string} [props.error]
 * @param {boolean} [props.disabled]
 * @param {React.Ref<HTMLInputElement>} ref
 */
export const Checkbox = forwardRef(function Checkbox(
  { className, label, description, error, id, ...props },
  ref
) {
  const checkboxId = id || props.name;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-neutral-300 text-primary-600 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error-500',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${checkboxId}-error`
              : description
                ? `${checkboxId}-description`
                : undefined
          }
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium text-neutral-700',
                  props.disabled && 'opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${checkboxId}-description`}
                className={cn(
                  'text-sm text-neutral-500',
                  props.disabled && 'opacity-50'
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p id={`${checkboxId}-error`} className="text-sm text-error-500 ml-7">
          {error}
        </p>
      )}
    </div>
  );
});
