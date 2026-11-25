import { DiagramGallery } from '../../../shared/components/DiagramGallery';
import { DocumentBrowser } from '../../../shared/components/DocumentBrowser';
import { Icon } from '../../../shared/components/Icons';
import { StatusMessage } from '../../../shared/components/StatusMessage';
import { useDocumentationTree } from '../../../shared/hooks/useDocumentationTree';
import { DOCUMENTATION_REPOSITORY_URL, folderUrl } from '../../../shared/services/github';
import { documentationHref } from '../../../shared/services/router';
import { ARCHITECTURE_FOLDER, GENERAL_FOLDER, isGeneralDocument, isImage } from '../../../shared/utils/documentation';
import '../styles/documentation.css';

interface DocumentationPageProps {
  documentPath: string;
  anchor: string | null;
}

// Documents shown first, in this order; any other general document follows alphabetically
const PREFERRED_ORDER = [
  `${GENERAL_FOLDER}/standards.md`,
  `${GENERAL_FOLDER}/permissions-matrix.md`,
  `${GENERAL_FOLDER}/audit-catalog.md`,
  `${GENERAL_FOLDER}/gateway-connection.md`,
];

const TOPICS = [
  {
    title: 'Estándares de integración',
    text: 'Reglas que comparten todos los servicios: puertos, tokens, cabeceras, errores, correlación y paginación.',
  },
  {
    title: 'Roles y permisos',
    text: 'Qué puede hacer cada rol en cada microservicio, permiso por permiso.',
  },
  {
    title: 'Auditoría',
    text: 'Qué acciones registra cada servicio y qué indicadores se calculan con ellas.',
  },
];

/**
 * Orders the general documents with the preferred ones first
 * @param first one document path
 * @param second another document path
 * @returns the comparison result for Array.sort
 */
function compareGeneral(first: string, second: string): number {
  let firstRank = PREFERRED_ORDER.indexOf(first);
  let secondRank = PREFERRED_ORDER.indexOf(second);
  if (firstRank < 0) {
    firstRank = PREFERRED_ORDER.length;
  }
  if (secondRank < 0) {
    secondRank = PREFERRED_ORDER.length;
  }
  if (firstRank !== secondRank) {
    return firstRank - secondRank;
  }
  return first.localeCompare(second);
}

/**
 * Page of the documentation shared by every service, read live from the repository
 * @param props selected document and heading to scroll to
 * @returns the documentation page
 */
export function DocumentationPage({ documentPath, anchor }: DocumentationPageProps) {
  const tree = useDocumentationTree();
  const documents = tree.paths.filter(isGeneralDocument).sort(compareGeneral);
  const diagrams = tree.paths
    .filter((path) => path.startsWith(`${ARCHITECTURE_FOLDER}/`) && isImage(path))
    .sort();

  let activePath = documents[0];
  if (documentPath) {
    activePath = documentPath;
  }
  let activeAnchor: string | undefined;
  if (anchor) {
    activeAnchor = anchor;
  }

  let content = <StatusMessage kind="loading">Consultando el repositorio de documentación…</StatusMessage>;
  if (tree.status === 'error') {
    content = (
      <StatusMessage kind="error">
        No fue posible consultar el repositorio de documentación. Intente de nuevo en unos minutos o{' '}
        <a href={folderUrl(GENERAL_FOLDER)} target="_blank" rel="noreferrer">véalo en GitHub</a>.
      </StatusMessage>
    );
  } else if (tree.status === 'ready' && !activePath) {
    content = <StatusMessage kind="empty">Todavía no hay documentación general publicada.</StatusMessage>;
  } else if (tree.status === 'ready') {
    content = (
      <DocumentBrowser
        documents={documents}
        activePath={activePath}
        anchor={activeAnchor}
        hrefFor={(path) => documentationHref(path)}
      />
    );
  }

  return (
    <div className="documentation-page">
      <header className="documentation-hero">
        <div className="documentation-hero-inner">
          <span className="eyebrow eyebrow-light">Documentación técnica</span>
          <h1>Las reglas que unen a todos los servicios</h1>
          <p>
            Además de la documentación propia de cada microservicio, el proyecto define acuerdos comunes que todos los
            equipos cumplen. Aquí se consultan tal como están hoy en el repositorio de documentación.
          </p>
          <div className="topic-row">
            {TOPICS.map((topic) => (
              <div key={topic.title} className="topic">
                <strong>{topic.title}</strong>
                <span>{topic.text}</span>
              </div>
            ))}
          </div>
          <a className="chip-button chip-light" href={DOCUMENTATION_REPOSITORY_URL} target="_blank" rel="noreferrer">
            <Icon name="github" />
            Repositorio de documentación
          </a>
        </div>
      </header>

      {diagrams.length > 0 && (
        <section className="documentation-diagrams">
          <h2>Diagramas del sistema</h2>
          <DiagramGallery paths={diagrams} />
        </section>
      )}

      <section className="documentation-body">{content}</section>
    </div>
  );
}
