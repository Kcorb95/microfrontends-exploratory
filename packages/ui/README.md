# @repo/ui

Shared UI component library for the micro-frontends monorepo. Built with React and Radix UI primitives, styled with Tailwind CSS.

## Installation

This package is internal to the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

## Exports

```javascript
// Main entry - all components
import { Button, Card, Modal, Input } from '@repo/ui';

// Design tokens
import { colors, spacing, typography } from '@repo/ui/tokens';

// React hooks
import { useMediaQuery, useTheme } from '@repo/ui/hooks';

// CSS styles (import in your app's global CSS)
import '@repo/ui/styles.css';
```

## Usage

### Import Components

```javascript
import { Button, Card, Modal } from '@repo/ui';

function MyComponent() {
  return (
    <Card>
      <h2>Welcome</h2>
      <Button variant="primary" onClick={() => console.log('clicked')}>
        Get Started
      </Button>
    </Card>
  );
}
```

### Import Styles

In your app's global CSS or layout:

```css
/* app/globals.css */
@import '@repo/ui/styles.css';
```

Or in JavaScript:

```javascript
// app/layout.jsx
import '@repo/ui/styles.css';
```

### Design Tokens

```javascript
import { colors, spacing } from '@repo/ui/tokens';

const styles = {
  backgroundColor: colors.primary[500],
  padding: spacing[4],
};
```

### Hooks

```javascript
import { useMediaQuery, useTheme } from '@repo/ui/hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## Components

### Primitives (Radix UI)

| Component | Description |
|-----------|-------------|
| `Accordion` | Expandable content sections |
| `Dialog` / `Modal` | Modal dialogs |
| `DropdownMenu` | Dropdown menus |
| `Select` | Select dropdowns |
| `Tabs` | Tab navigation |
| `Toast` | Toast notifications |

### Custom Components

| Component | Description |
|-----------|-------------|
| `Button` | Styled button with variants |
| `Card` | Content card container |
| `Input` | Form input field |
| `Badge` | Status badges |

## Directory Structure

```
packages/ui/
├── src/
│   ├── index.js              # Main component exports
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── ...
│   ├── tokens/
│   │   └── index.js          # Design tokens
│   ├── hooks/
│   │   └── index.js          # React hooks
│   └── styles.css            # Global styles
├── package.json
└── eslint.config.js
```

## Development

```bash
# Run linting
pnpm lint

# Fix lint errors
pnpm lint:fix

# Clean node_modules
pnpm clean
```

## Styling

Components use:
- **Tailwind CSS** for utility classes
- **class-variance-authority** for variant management
- **@repo/utils** for class name merging (`cn` utility)

Example component with variants:

```javascript
import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## Dependencies

- `@radix-ui/react-*` - Accessible UI primitives
- `class-variance-authority` - Variant management

## Peer Dependencies

- `@repo/utils`: workspace:*
- `react`: ^18.2.0 || ^19.0.0
- `react-dom`: ^18.2.0 || ^19.0.0
