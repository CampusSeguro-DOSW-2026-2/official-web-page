import { findServiceByPath } from '../data/services';
import { documentationHref, serviceHref } from '../services/router';

/** Folder of the general documentation shown on the documentation page */
export const GENERAL_FOLDER = 'integration';

/** Folder of the system-wide architecture diagrams */
export const ARCHITECTURE_FOLDER = 'integration/architecture';

const DOCUMENT_TITLES: Record<string, string> = {
  'README.md': 'Presentación',
  '1_requirements.md': 'Requerimientos',
  '2_forms-inputs.md': 'Formularios y entradas',
  '3_data-model.md': 'Modelo de datos',
  'contracts.md': 'Contratos',
  'quality-and-tests.md': 'Calidad y pruebas',
  'security.md': 'Seguridad',
  'integration-guide.md': 'Guía de integración',
  'jwt-spec.md': 'Especificación del JWT',
  'standards.md': 'Estándares de integración',
  'permissions-matrix.md': 'Matriz de roles y permisos',
  'audit-catalog.md': 'Catálogo de auditoría',
  'gateway-connection.md': 'Conexión al API Gateway',
};

const DIAGRAM_TITLES: [RegExp, string][] = [
  [/c4-1-context/i, 'C4 · Contexto'],
  [/c4-2-containers/i, 'C4 · Contenedores'],
  [/c4-3-components/i, 'C4 · Componentes'],
  [/classes/i, 'C4 · Código'],
  [/er-physical/i, 'Modelo de datos físico'],
  [/(^|-)er(\.|-)/i, 'Modelo entidad-relación'],
  [/deployment|infrastructure/i, 'Despliegue e infraestructura'],
  [/flows/i, 'Flujos'],
  [/low-fidelity/i, 'Interfaz de baja fidelidad'],
];

/**
 * Gets the name of a file without its folders
 * @param path file path
 * @returns the last segment of the path
 */
export function fileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

/**
 * Turns a file name into readable text
 * @param name file name
 * @returns the name without extension, separators or leading numbers
 */
function humanize(name: string): string {
  const base = name
    .replace(/\.(drawio\.)?[a-z0-9]+$/i, '')
    .replace(/^\d+_/, '')
    .replace(/[_-]+/g, ' ')
    .trim();
  if (base.length === 0) {
    return name;
  }
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/**
 * Gets the title shown for a document of the repository
 * @param path document path
 * @returns a readable title
 */
export function documentTitle(path: string): string {
  const name = fileName(path);
  if (name === 'README.md' && /\/diagrams\//i.test(path)) {
    return 'Diagramas: cómo verlos';
  }
  const known = DOCUMENT_TITLES[name];
  if (known) {
    return known;
  }
  return humanize(name);
}

/**
 * Gets the title shown for a diagram of the repository
 * @param path diagram path
 * @returns a readable title
 */
export function diagramTitle(path: string): string {
  const name = fileName(path);
  const match = DIAGRAM_TITLES.find(([pattern]) => pattern.test(name));
  if (match) {
    return match[1];
  }
  return humanize(name);
}

/**
 * Tells whether a path is a Markdown document
 * @param path file path
 * @returns true for .md files
 */
export function isMarkdown(path: string): boolean {
  return /\.md$/i.test(path);
}

/**
 * Tells whether a path is an image that can be shown on the page
 * @param path file path
 * @returns true for SVG, PNG and JPEG files
 */
export function isImage(path: string): boolean {
  return /\.(svg|png|jpe?g)$/i.test(path);
}

/**
 * Tells whether a path is a diagram of a service
 * @param path file path
 * @returns true for images inside a diagrams folder
 */
export function isDiagram(path: string): boolean {
  return isImage(path) && /(^|\/)diagrams\//i.test(path);
}

/**
 * Tells whether a path is an OpenAPI contract
 * @param path file path
 * @returns true for the api/openapi.yml contract of a service
 */
export function isApiSpec(path: string): boolean {
  return /(^|\/)api\/openapi\.yml$/i.test(path);
}

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

/**
 * Counts the operations (endpoints) declared in the paths section of an OpenAPI contract written in YAML
 * @param text content of the contract
 * @returns the number of HTTP operations of the contract
 */
export function countOperations(text: string): number {
  let inPaths = false;
  let pathIndent = -1;
  let operationIndent = -1;
  let count = 0;
  for (const line of text.split(/\r?\n/)) {
    const match = /^( *)(?:'([^']+)'|"([^"]+)"|([^\s'"#][^:#]*?)):(?:\s|$)/.exec(line);
    if (!match) {
      continue;
    }
    const indent = match[1].length;
    const key = match[2] ?? match[3] ?? match[4];
    if (indent === 0) {
      inPaths = key === 'paths';
      pathIndent = -1;
      operationIndent = -1;
      continue;
    }
    if (!inPaths) {
      continue;
    }
    if (pathIndent < 0 && key.startsWith('/')) {
      pathIndent = indent;
    }
    if (indent <= pathIndent) {
      operationIndent = -1;
      continue;
    }
    if (operationIndent < 0) {
      operationIndent = indent;
    }
    if (indent === operationIndent && HTTP_METHODS.includes(key)) {
      count += 1;
    }
  }
  return count;
}

/**
 * Tells whether a path is a file that can only be downloaded
 * @param path file path
 * @returns true for PDF and Word files
 */
export function isDownload(path: string): boolean {
  return /\.(pdf|docx?)$/i.test(path);
}

/**
 * Orders documents with the numbered ones first and the presentation at the top
 * @param first one document path
 * @param second another document path
 * @returns the comparison result for Array.sort
 */
export function compareDocuments(first: string, second: string): number {
  const rank = (path: string) => {
    const name = fileName(path);
    if (name === 'README.md' && path.split('/').length <= 2) {
      return '0';
    }
    if (/^\d/.test(name)) {
      return `1${name}`;
    }
    return `2${path}`;
  };
  return rank(first).localeCompare(rank(second));
}

/** A link of a Markdown document resolved against the repository */
export interface ResolvedLink {
  path: string;
  anchor: string;
}

/**
 * Resolves a relative link of a document against the document location
 * @param documentPath path of the document that contains the link
 * @param href link as written in the document
 * @returns the repository path and the anchor of the target
 */
export function resolveLink(documentPath: string, href: string): ResolvedLink {
  const url = new URL(href, `https://repository.local/${documentPath}`);
  let path = url.pathname.replace(/^\//, '');
  let anchor = url.hash.replace(/^#/, '');
  try {
    path = decodeURIComponent(path);
    anchor = decodeURIComponent(anchor);
  } catch {
    // The link keeps its encoded form when it is not valid URI encoding
  }
  return { path, anchor };
}

/**
 * Builds the link of the site that shows a document of the repository
 * @param path document path inside the repository
 * @param anchor heading to scroll to
 * @returns the hash link of the page that shows the document
 */
export function siteHrefForDocument(path: string, anchor?: string): string {
  const service = findServiceByPath(path);
  if (service) {
    const relative = path.slice(service.folder.length + 1);
    return serviceHref(service.slug, 'documentos', relative, anchor);
  }
  return documentationHref(path, anchor);
}

/**
 * Tells whether a document belongs to the general documentation page
 * @param path file path
 * @returns true for Markdown documents of the general folder that are not placeholders
 */
export function isGeneralDocument(path: string): boolean {
  return isMarkdown(path)
    && path.startsWith(`${GENERAL_FOLDER}/`)
    && !path.startsWith(`${ARCHITECTURE_FOLDER}/`);
}
