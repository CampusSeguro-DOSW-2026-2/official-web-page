import type { CSSProperties } from 'react';
import { DiagramGallery } from '../../../shared/components/DiagramGallery';
import { DocumentBrowser } from '../../../shared/components/DocumentBrowser';
import { Icon } from '../../../shared/components/Icons';
import { StatusMessage } from '../../../shared/components/StatusMessage';
import { SERVICES } from '../../../shared/data/services';
import { useDocumentationTree } from '../../../shared/hooks/useDocumentationTree';
import { blobUrl, folderUrl, ORGANIZATION_URL } from '../../../shared/services/github';
import { serviceHref } from '../../../shared/services/router';
import type { ServiceInfo } from '../../../shared/types';
import {
  compareDocuments,
  fileName,
  isApiSpec,
  isDiagram,
  isDownload,
  isMarkdown,
} from '../../../shared/utils/documentation';
import { ApiExplorer } from '../components/ApiExplorer';
import { ServiceOverview } from '../components/ServiceOverview';
import '../styles/service.css';

interface ServicePageProps {
  service: ServiceInfo;
  tab: string;
  documentPath: string;
  anchor: string | null;
}

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'diagramas', label: 'Diagramas' },
  { id: 'api', label: 'API' },
];

/**
 * Page of one service: summary, documents, diagrams and API contract, read live from the repository
 * @param props service, selected tab, selected document and heading to scroll to
 * @returns the service page
 */
export function ServicePage({ service, tab, documentPath, anchor }: ServicePageProps) {
  const tree = useDocumentationTree();
  const prefix = `${service.folder}/`;
  const files = tree.paths.filter((path) => path.startsWith(prefix));
  const documents = files.filter(isMarkdown).sort(compareDocuments);
  const diagrams = files.filter(isDiagram).sort();
  const specs = files.filter(isApiSpec).sort();
  const downloads = files.filter(isDownload).sort();

  const counts = { documents: documents.length + downloads.length, diagrams: diagrams.length, specs: specs.length };
  const index = SERVICES.findIndex((item) => item.slug === service.slug);
  const previous = SERVICES[(index - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(index + 1) % SERVICES.length];

  let activeTab = tab;
  if (!TABS.some((item) => item.id === tab)) {
    activeTab = 'resumen';
  }

  let content = <ServiceOverview service={service} counts={counts} ready={tree.status === 'ready'} />;
  if (activeTab !== 'resumen') {
    if (tree.status === 'loading') {
      content = <StatusMessage kind="loading">Consultando el repositorio de documentación…</StatusMessage>;
    } else if (tree.status === 'error') {
      content = (
        <StatusMessage kind="error">
          No fue posible consultar el repositorio de documentación. Intente de nuevo en unos minutos o{' '}
          <a href={folderUrl(service.folder)} target="_blank" rel="noreferrer">véalo en GitHub</a>.
        </StatusMessage>
      );
    } else if (activeTab === 'documentos') {
      content = renderDocuments(service, documents, downloads, documentPath, anchor);
    } else if (activeTab === 'diagramas') {
      content = renderDiagrams(diagrams);
    } else {
      content = renderApi(specs);
    }
  }

  return (
    <div className="service-page" style={{ '--accent': service.accent } as CSSProperties}>
      <header className="service-hero">
        <div className="service-hero-inner">
          <a className="back-link" href="#/seccion/funcionalidades">
            <Icon name="arrow-left" />
            Todos los servicios
          </a>
          <span className="service-code">{service.code}</span>
          <h1>{service.name}</h1>
          <p>{service.tagline}</p>
          <div className="service-links">
            <a className="chip-button chip-light" href={`${ORGANIZATION_URL}/${service.repository}`} target="_blank" rel="noreferrer">
              <Icon name="github" />
              Código fuente
            </a>
            <a className="chip-button chip-light" href={folderUrl(service.folder)} target="_blank" rel="noreferrer">
              <Icon name="file" />
              Documentación en GitHub
            </a>
          </div>
        </div>
      </header>

      <nav className="tabs" aria-label={`Secciones de ${service.name}`}>
        <div className="tabs-inner">
          {TABS.map((item) => {
            let current: 'page' | undefined;
            if (item.id === activeTab) {
              current = 'page';
            }
            return (
              <a key={item.id} href={serviceHref(service.slug, item.id)} aria-current={current}>
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="service-body">{content}</div>

      <nav className="service-pager" aria-label="Otros servicios">
        <a href={serviceHref(previous.slug)}>
          <Icon name="arrow-left" />
          <span>
            <small>Anterior</small>
            {previous.code} · {previous.name}
          </span>
        </a>
        <a href={serviceHref(next.slug)} className="pager-next">
          <span>
            <small>Siguiente</small>
            {next.code} · {next.name}
          </span>
          <Icon name="arrow-right" />
        </a>
      </nav>
    </div>
  );
}

/**
 * Builds the documents tab
 * @param service service of the page
 * @param documents Markdown documents of the service
 * @param downloads files of the service that can only be downloaded
 * @param documentPath selected document relative to the service folder
 * @param anchor heading to scroll to
 * @returns the content of the tab
 */
function renderDocuments(
  service: ServiceInfo,
  documents: string[],
  downloads: string[],
  documentPath: string,
  anchor: string | null,
) {
  if (documents.length === 0 && downloads.length === 0) {
    return <StatusMessage kind="empty">Este servicio todavía no ha publicado documentos.</StatusMessage>;
  }
  if (documents.length === 0) {
    return (
      <div className="downloads-only">
        <p>La documentación de este servicio está disponible como archivos:</p>
        <DownloadList downloads={downloads} />
      </div>
    );
  }
  let activePath = documents[0];
  if (documentPath) {
    activePath = `${service.folder}/${documentPath}`;
  }
  let activeAnchor: string | undefined;
  if (anchor) {
    activeAnchor = anchor;
  }
  return (
    <DocumentBrowser
      documents={documents}
      downloads={downloads}
      activePath={activePath}
      anchor={activeAnchor}
      hrefFor={(path) => serviceHref(service.slug, 'documentos', path.slice(service.folder.length + 1))}
    />
  );
}

/**
 * Links to download files of the repository
 * @param props paths of the files
 * @returns the list of links
 */
function DownloadList({ downloads }: { downloads: string[] }) {
  return (
    <ul className="download-list">
      {downloads.map((path) => (
        <li key={path}>
          <a className="chip-button" href={blobUrl(path)} target="_blank" rel="noreferrer">
            <Icon name="download" />
            {fileName(path)}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Builds the diagrams tab
 * @param diagrams images of the diagrams of the service
 * @returns the content of the tab
 */
function renderDiagrams(diagrams: string[]) {
  if (diagrams.length === 0) {
    return <StatusMessage kind="empty">Este servicio todavía no ha publicado diagramas en formato de imagen.</StatusMessage>;
  }
  return <DiagramGallery paths={diagrams} />;
}

/**
 * Builds the API tab
 * @param specs OpenAPI contracts of the service
 * @returns the content of the tab
 */
function renderApi(specs: string[]) {
  if (specs.length === 0) {
    return <StatusMessage kind="empty">Este servicio todavía no ha publicado su contrato OpenAPI.</StatusMessage>;
  }
  return <ApiExplorer specs={specs} />;
}
