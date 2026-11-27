import { Icon } from '../../../shared/components/Icons';
import { useOperationCounts } from '../../../shared/hooks/useOperationCounts';
import { blobUrl } from '../../../shared/services/github';
import { serviceHref } from '../../../shared/services/router';
import type { ServiceInfo } from '../../../shared/types';
import { diagramTitle, documentTitle, fileName } from '../../../shared/utils/documentation';

interface ServiceOverviewProps {
  service: ServiceInfo;
  documents: string[];
  downloads: string[];
  diagrams: string[];
  specs: string[];
  ready: boolean;
}

/**
 * Gets the readable title of a file that can only be downloaded, with its format
 * @param path file path
 * @returns the title followed by the file format
 */
function downloadTitle(path: string): string {
  const extension = fileName(path).split('.').pop() ?? '';
  let title = documentTitle(path);
  if (/(^|\/)diagra(m|ma)s\//i.test(path)) {
    title = diagramTitle(path);
  }
  return `${title} · ${extension.toUpperCase()}`;
}

/**
 * Groups the diagrams of a service by their kind
 * @param diagrams paths of the diagrams
 * @returns each kind of diagram with the number of diagrams of that kind
 */
function groupDiagrams(diagrams: string[]): { title: string; count: number }[] {
  const groups = new Map<string, number>();
  diagrams
    .map((path) => diagramTitle(path))
    .sort((first, second) => first.localeCompare(second))
    .forEach((title) => groups.set(title, (groups.get(title) ?? 0) + 1));
  return Array.from(groups, ([title, count]) => ({ title, count }));
}

/**
 * Summary of a service written for people outside the project
 * @param props service, its documents, downloads, diagrams and contracts, and whether they are already listed
 * @returns the overview tab
 */
export function ServiceOverview({ service, documents, downloads, diagrams, specs, ready }: ServiceOverviewProps) {
  const operations = useOperationCounts(specs);
  const diagramGroups = groupDiagrams(diagrams);

  /**
   * Formats the number of files of a group, showing a dash until the files are listed
   * @param count number of files of the group
   * @returns the text of the count
   */
  const countText = (count: number) => {
    if (!ready) {
      return '—';
    }
    return String(count);
  };

  /**
   * Formats the number of endpoints of a contract, showing a dash until it is counted
   * @param spec path of the contract
   * @returns the text with the number of endpoints
   */
  const endpointsText = (spec: string) => {
    if (operations.status === 'loading') {
      return '—';
    }
    if (operations.status === 'error') {
      return 'Ver contrato';
    }
    const count = operations.counts[spec] ?? 0;
    if (count === 1) {
      return '1 endpoint';
    }
    return `${count} endpoints`;
  };

  /**
   * Gets the name shown for a contract, adding the file name when the service has several
   * @param spec path of the contract
   * @returns the name of the contract
   */
  const contractName = (spec: string) => {
    if (specs.length > 1) {
      return `OpenAPI · ${fileName(spec)}`;
    }
    return 'Contrato OpenAPI';
  };

  return (
    <div className="overview">
      <div className="overview-main">
        <h2>¿Qué hace?</h2>
        <p className="overview-summary">{service.summary}</p>
        <h2>Funcionalidades principales</h2>
        <ul className="check-list">
          {service.highlights.map((highlight) => (
            <li key={highlight}>
              <Icon name="shield" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
      <aside className="overview-side">
        <div className="side-card">
          <h3>Tecnologías</h3>
          <ul className="pill-list">
            {service.technologies.map((technology) => (
              <li key={technology} className="pill">{technology}</li>
            ))}
          </ul>
        </div>
        <div className="side-card">
          <h3>Documentación disponible</h3>
          <div className="doc-summary">
            <div className="doc-group">
              <a className="doc-group-head" href={serviceHref(service.slug, 'documentos')}>
                <Icon name="file" />
                <span>Documentos</span>
                <strong>{countText(documents.length + downloads.length)}</strong>
              </a>
              {ready && documents.length + downloads.length > 0 && (
                <ul className="doc-items">
                  {documents.map((path) => (
                    <li key={path}>
                      <a href={serviceHref(service.slug, 'documentos', path.slice(service.folder.length + 1))}>
                        {documentTitle(path)}
                      </a>
                    </li>
                  ))}
                  {downloads.map((path) => (
                    <li key={path}>
                      <a href={blobUrl(path)} target="_blank" rel="noreferrer">
                        {downloadTitle(path)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="doc-group">
              <a className="doc-group-head" href={serviceHref(service.slug, 'diagramas')}>
                <Icon name="image" />
                <span>Diagramas</span>
                <strong>{countText(diagrams.length)}</strong>
              </a>
              {ready && diagramGroups.length > 0 && (
                <ul className="doc-items">
                  {diagramGroups.map((group) => (
                    <li key={group.title}>
                      <span>{group.title}</span>
                      <span className="doc-item-count">{group.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="doc-group">
              <a className="doc-group-head" href={serviceHref(service.slug, 'api')}>
                <Icon name="code" />
                <span>Contrato de API</span>
                <strong>{countText(specs.length)}</strong>
              </a>
              {ready && specs.length > 0 && (
                <ul className="doc-items">
                  {specs.map((spec) => (
                    <li key={spec}>
                      <span>{contractName(spec)}</span>
                      <span className="doc-item-count">{endpointsText(spec)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
