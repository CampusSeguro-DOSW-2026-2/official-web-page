import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

/**
 * Heading shared by the sections of the home page
 * @param props small label, title and introduction
 * @returns the heading of a section
 */
export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
