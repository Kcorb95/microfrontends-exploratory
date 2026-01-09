import { Container } from '@repo/ui';

/**
 * Testimonial slice component
 * @param {Object} props
 * @param {Object} props.primary - Primary slice data
 */
export function Testimonial({ primary }) {
  const {
    quote,
    author_name,
    author_title,
    company,
    company_logo,
  } = primary;

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <svg
            className="w-12 h-12 mx-auto mb-6 text-primary-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl md:text-3xl font-medium text-neutral-900 mb-8">
            "{quote}"
          </blockquote>
          <div className="flex flex-col items-center gap-2">
            {company_logo && (
              <img
                src={company_logo}
                alt={company}
                className="h-8 mb-2 opacity-60"
              />
            )}
            <div>
              <p className="font-semibold text-neutral-900">{author_name}</p>
              <p className="text-neutral-600">
                {author_title}
                {company && `, ${company}`}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
