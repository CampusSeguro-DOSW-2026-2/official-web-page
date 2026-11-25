import type { Route } from '../types';

/**
 * Decodes one segment of the route, keeping it as it is when it is not valid URI encoding
 * @param segment raw segment taken from the hash
 * @returns the decoded segment
 */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Reads the current route from the URL hash (#/path?query)
 * @returns the path, its segments and the query parameters
 */
export function readRoute(): Route {
  const raw = window.location.hash.replace(/^#/, '');
  const separator = raw.indexOf('?');
  let pathPart = raw;
  let queryPart = '';
  if (separator >= 0) {
    pathPart = raw.slice(0, separator);
    queryPart = raw.slice(separator + 1);
  }
  let path = pathPart;
  if (path.length === 0) {
    path = '/';
  }
  const segments = path
    .split('/')
    .filter((segment) => segment.length > 0)
    .map(decodeSegment);
  return { path, segments, query: new URLSearchParams(queryPart) };
}

/**
 * Encodes a repository path so it can travel inside a route
 * @param path file path relative to a folder
 * @returns the path with every segment encoded
 */
function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

/**
 * Builds the link to a section of the home page
 * @param sectionId identifier of the section
 * @returns the hash link to the section
 */
export function sectionHref(sectionId: string): string {
  return `#/seccion/${sectionId}`;
}

/**
 * Builds the link to the page of a service, optionally to one of its tabs and documents
 * @param slug identifier of the service in the routes
 * @param tab tab of the service page
 * @param documentPath path of a document relative to the service folder
 * @param anchor heading to scroll to inside the document
 * @returns the hash link to the service page
 */
export function serviceHref(slug: string, tab?: string, documentPath?: string, anchor?: string): string {
  let href = `#/servicios/${slug}`;
  if (tab) {
    href += `/${tab}`;
  }
  if (documentPath) {
    href += `/${encodePath(documentPath)}`;
  }
  if (anchor) {
    href += `?ancla=${encodeURIComponent(anchor)}`;
  }
  return href;
}

/**
 * Builds the link to the general documentation page, optionally to one document
 * @param documentPath path of the document inside the documentation repository
 * @param anchor heading to scroll to inside the document
 * @returns the hash link to the documentation page
 */
export function documentationHref(documentPath?: string, anchor?: string): string {
  let href = '#/documentacion';
  if (documentPath) {
    href += `/${encodePath(documentPath)}`;
  }
  if (anchor) {
    href += `?ancla=${encodeURIComponent(anchor)}`;
  }
  return href;
}
