'use client';

import { createContext, useContext, useState } from 'react';
import { cn } from '@repo/utils';

const TabsContext = createContext(null);

/**
 * Tabs container component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.defaultValue]
 * @param {string} [props.value]
 * @param {(value: string) => void} [props.onValueChange]
 * @param {React.ReactNode} props.children
 */
export function Tabs({
  className,
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  ...props
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * Tab list component (container for triggers)
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function TabsList({ className, children, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-lg bg-neutral-100 p-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Tab trigger button
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} props.value
 * @param {boolean} [props.disabled]
 * @param {React.ReactNode} props.children
 */
export function TabsTrigger({ className, value, disabled, children, ...props }) {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-neutral-900 shadow-sm'
          : 'text-neutral-600 hover:text-neutral-900',
        className
      )}
      onClick={() => context?.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Tab content panel
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} props.value
 * @param {React.ReactNode} props.children
 */
export function TabsContent({ className, value, children, ...props }) {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      tabIndex={0}
      className={cn('mt-4 focus:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}
