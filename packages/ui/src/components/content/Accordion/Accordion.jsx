'use client';

import { createContext, useContext, useState } from 'react';
import { cn } from '@repo/utils';

const AccordionContext = createContext(null);
const AccordionItemContext = createContext(null);

/**
 * Accordion container
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'single' | 'multiple'} [props.type]
 * @param {string | string[]} [props.defaultValue]
 * @param {string | string[]} [props.value]
 * @param {(value: string | string[]) => void} [props.onValueChange]
 * @param {React.ReactNode} props.children
 */
export function Accordion({
  className,
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  ...props
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue || (type === 'multiple' ? [] : '')
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (itemValue) => {
    let newValue;

    if (type === 'multiple') {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(itemValue)) {
        newValue = currentValues.filter((v) => v !== itemValue);
      } else {
        newValue = [...currentValues, itemValue];
      }
    } else {
      newValue = value === itemValue ? '' : itemValue;
    }

    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const isExpanded = (itemValue) => {
    if (type === 'multiple') {
      return Array.isArray(value) && value.includes(itemValue);
    }
    return value === itemValue;
  };

  return (
    <AccordionContext.Provider value={{ type, isExpanded, onToggle: handleValueChange }}>
      <div className={cn('divide-y divide-neutral-200', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

/**
 * Accordion item
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} props.value
 * @param {boolean} [props.disabled]
 * @param {React.ReactNode} props.children
 */
export function AccordionItem({ className, value, disabled, children, ...props }) {
  return (
    <AccordionItemContext.Provider value={{ value, disabled }}>
      <div
        className={cn('', disabled && 'opacity-50', className)}
        data-state={disabled ? 'disabled' : undefined}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

/**
 * Accordion trigger button
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function AccordionTrigger({ className, children, ...props }) {
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  const isExpanded = accordionContext?.isExpanded(itemContext?.value);
  const isDisabled = itemContext?.disabled;

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-colors',
        'hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        isDisabled && 'pointer-events-none',
        className
      )}
      onClick={() => accordionContext?.onToggle(itemContext?.value)}
      disabled={isDisabled}
      aria-expanded={isExpanded}
      {...props}
    >
      {children}
      <svg
        className={cn(
          'h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200',
          isExpanded && 'rotate-180'
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

/**
 * Accordion content
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function AccordionContent({ className, children, ...props }) {
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  const isExpanded = accordionContext?.isExpanded(itemContext?.value);

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200',
        isExpanded ? 'max-h-96' : 'max-h-0'
      )}
      role="region"
      aria-hidden={!isExpanded}
      {...props}
    >
      <div className={cn('pb-4 text-sm text-neutral-600', className)}>
        {children}
      </div>
    </div>
  );
}
