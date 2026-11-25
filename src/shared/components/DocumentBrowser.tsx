import { lazy, Suspense } from 'react';
import { blobUrl } from '../services/github';
import { documentTitle, fileName } from '../utils/documentation';
import { Icon } from './Icons';
import { StatusMessage } from './StatusMessage';

// The Markdown renderer is large, so it is downloaded only when a document is opened
const MarkdownView = lazy(async () => {
  const module = await import('./MarkdownView');
  return { default: module.MarkdownView };
});

interface DocumentBrowserProps {
  documents: string[];
  activePath: string;
  anchor?: string;
  downloads?: string[];
  hrefFor: (path: string) => string;
}

/**
 * Shows a list of documents next to the selected one
 * @param props documents, the selected one, files to download and the link of each document
 * @returns the document browser
 */
export function DocumentBrowser({ documents, activePath, anchor, downloads = [], hrefFor }: DocumentBrowserProps) {
  return (
    <div className="doc-browser">
      <nav className="doc-index" aria-label="Documentos">
        <span className="doc-index-title">Documentos</span>
        <ul>
          {documents.map((path) => {
            let current: 'page' | undefined;
            if (path === activePath) {
              current = 'page';
            }
            return (
              <li key={path}>
                <a href={hrefFor(path)} aria-current={current}>
                  <Icon name="file" />
                  <span>{documentTitle(path)}</span>
                </a>
              </li>
            );
          })}
        </ul>
        {downloads.length > 0 && (
          <>
            <span className="doc-index-title">Archivos</span>
            <ul>
              {downloads.map((path) => (
                <li key={path}>
                  <a href={blobUrl(path)} target="_blank" rel="noreferrer">
                    <Icon name="download" />
                    <span>{documentTitle(path)}</span>
                    <small>{fileName(path).split('.').pop()?.toUpperCase()}</small>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
      <div className="doc-content">
        <div className="doc-source">
          <span>{activePath}</span>
          <a href={blobUrl(activePath)} target="_blank" rel="noreferrer">
            <Icon name="github" />
            Ver en GitHub
          </a>
        </div>
        <Suspense fallback={<StatusMessage kind="loading">Preparando el visor de documentos…</StatusMessage>}>
          <MarkdownView path={activePath} anchor={anchor} />
        </Suspense>
      </div>
    </div>
  );
}
