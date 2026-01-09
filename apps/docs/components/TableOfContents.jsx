import { cn } from '@repo/utils';

/**
 * Table of Contents component
 * Extracts headings from markdown content
 */
export function TableOfContents({ content }) {
  if (!content) return null;

  // Extract headings from markdown
  const headings = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: match[2].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    });
  }

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1">
      <h4 className="font-semibold text-neutral-900 mb-3 text-sm">
        On this page
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                'block text-neutral-600 hover:text-neutral-900 transition-colors',
                heading.level === 3 && 'pl-3'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
