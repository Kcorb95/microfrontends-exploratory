import { forwardRef } from 'react';
import { cn } from '@repo/utils';

/**
 * Radio button component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.label]
 * @param {string} [props.description]
 * @param {boolean} [props.disabled]
 * @param {React.Ref<HTMLInputElement>} ref
 */
export const Radio = forwardRef(function Radio(
  { className, label, description, id, ...props },
  ref
) {
  const radioId = id || `${props.name}-${props.value}`;

  return (
    <div className="flex items-start gap-3">
      <input
        ref={ref}
        id={radioId}
        type="radio"
        className={cn(
          'h-4 w-4 border-neutral-300 text-primary-600 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={radioId}
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
  );
});

/**
 * Radio group component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} props.name
 * @param {string} [props.value]
 * @param {(value: string) => void} [props.onChange]
 * @param {Array<{value: string, label: string, description?: string, disabled?: boolean}>} props.options
 */
export function RadioGroup({
  className,
  label,
  error,
  name,
  value,
  onChange,
  options,
  ...props
}) {
  return (
    <fieldset className={cn('flex flex-col gap-3', className)} {...props}>
      {label && (
        <legend className="text-sm font-medium text-neutral-700 mb-1">
          {label}
        </legend>
      )}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ))}
      </div>
      {error && <p className="text-sm text-error-500">{error}</p>}
    </fieldset>
  );
}
