import { useEffect, type MouseEvent, type ReactNode } from 'react';
import Markdown, { type Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { findServiceByPath } from '../data/services';
import { useFileText } from '../hooks/useFileText';
import { blobUrl, folderUrl } from '../services/github';
import { serviceHref } from '../services/router';
import { isMarkdown, resolveLink, siteHrefForDocument } from '../utils/documentation';
import { RepositoryImage } from './RepositoryImage';
import { StatusMessage } from './StatusMessage';

// Raw HTML of the documents is allowed but sanitized; ids keep their names so in-document links work
const SANITIZE_SCHEMA = {
  ...defaultSchema,
  clobber: [],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'id', 'align'],
  },
};

interface MarkdownViewProps {
  path: string;
  anchor?: string;
}

/**
 * Scrolls to an element of the page by its identifier
 * @param id identifier of the element
 * @returns true when the element exists
 */
function scrollToElement(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) {
    return false;
  }
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

/**
 * Builds the link of a document so it stays inside the site whenever possible
 * @param documentPath path of the document that contains the link
 * @param href link as written in the document
 * @param children content of the link
 * @param id identifier of the link, used by documents as anchor targets
 * @returns the link element
 */
function renderLink(documentPath: string, href: string | undefined, children: ReactNode, id: string | undefined) {
  if (!href) {
    return <a id={id}>{children}</a>;
  }
  if (href.startsWith('#')) {
    const target = href.slice(1);
    const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      let decoded = target;
      try {
        decoded = decodeURIComponent(target);
      } catch {
        // The anchor keeps its encoded form when it is not valid URI encoding
      }
      scrollToElement(decoded);
    };
    return <a id={id} href={href} onClick={onClick}>{children}</a>;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return <a id={id} href={href} target="_blank" rel="noreferrer">{children}</a>;
  }
  const resolved = resolveLink(documentPath, href);
  if (isMarkdown(resolved.path)) {
    return <a id={id} href={siteHrefForDocument(resolved.path, resolved.anchor)}>{children}</a>;
  }
  const folderPath = resolved.path.replace(/\/$/, '');
  const lastSegment = folderPath.split('/').pop() ?? '';
  if (!lastSegment.includes('.')) {
    const service = findServiceByPath(folderPath);
    if (service && service.folder === folderPath) {
      return <a id={id} href={serviceHref(service.slug)}>{children}</a>;
    }
    return <a id={id} href={folderUrl(folderPath)} target="_blank" rel="noreferrer">{children}</a>;
  }
  return <a id={id} href={blobUrl(resolved.path)} target="_blank" rel="noreferrer">{children}</a>;
}

/**
 * Shows a Markdown document of the documentation repository, read live from GitHub
 * @param props path of the document and optional heading to scroll to
 * @returns the rendered document
 */
export function MarkdownView({ path, anchor }: MarkdownViewProps) {
  const file = useFileText(path);

  useEffect(() => {
    if (file.status === 'ready' && anchor) {
      const timer = window.setTimeout(() => {
        scrollToElement(anchor);
      }, 50);
      return () => {
        window.clearTimeout(timer);
      };
    }
    return undefined;
  }, [file.status, anchor]);

  const components: Components = {
    a(props) {
      return renderLink(path, props.href, props.children, props.id);
    },
    img(props) {
      const source = props.src;
      let alt = '';
      if (typeof props.alt === 'string') {
        alt = props.alt;
      }
      if (typeof source !== 'string' || source.length === 0) {
        return null;
      }
      if (/^[a-z][a-z0-9+.-]*:/i.test(source)) {
        return <img src={source} alt={alt} loading="lazy" />;
      }
      return <RepositoryImage path={resolveLink(path, source).path} alt={alt} />;
    },
    table(props) {
      return (
        <div className="table-scroll">
          <table>{props.children}</table>
        </div>
      );
    },
  };

  if (file.status === 'loading') {
    return <StatusMessage kind="loading">Cargando el documento desde el repositorio…</StatusMessage>;
  }
  if (file.status === 'error') {
    return (
      <StatusMessage kind="error">
        No fue posible cargar el documento. <a href={blobUrl(path)} target="_blank" rel="noreferrer">Verlo en GitHub</a>
      </StatusMessage>
    );
  }
  return (
    <article className="markdown">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, SANITIZE_SCHEMA], rehypeSlug]}
        components={components}
      >
        {file.text}
      </Markdown>
    </article>
  );
}
