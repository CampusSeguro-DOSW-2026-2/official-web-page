/** Current location of the single page application, read from the URL hash */
export interface Route {
  path: string;
  segments: string[];
  query: URLSearchParams;
}

/** A microservice or the API Gateway, as presented on the site */
export interface ServiceInfo {
  slug: string;
  code: string;
  name: string;
  folder: string;
  tagline: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  accent: string;
}

/** A member of the project team */
export interface TeamMember {
  name: string;
  github: string;
}

/** A group of technologies shown together */
export interface TechnologyGroup {
  title: string;
  description: string;
  items: string[];
}

/** Loading state of data read from the documentation repository */
export type LoadStatus = 'loading' | 'ready' | 'error';
