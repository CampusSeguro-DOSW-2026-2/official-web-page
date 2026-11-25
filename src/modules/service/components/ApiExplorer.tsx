import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../shared/components/Icons';
import { StatusMessage } from '../../../shared/components/StatusMessage';
import { blobUrl, rawUrl } from '../../../shared/services/github';
import { fileName } from '../../../shared/utils/documentation';

interface ApiExplorerProps {
  specs: string[];
}

/**
 * Interactive Swagger UI over the OpenAPI contracts of a service, read live from the repository
 * @param props paths of the contracts of the service
 * @returns the API explorer
 */
export function ApiExplorer({ specs }: ApiExplorerProps) {
  const [selected, setSelected] = useState(specs[0]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);

  let specPath = selected;
  if (!specs.includes(selected)) {
    specPath = specs[0];
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }
    let active = true;
    setStatus('loading');
    // Swagger UI is large, so it is downloaded only when a contract is opened
    Promise.all([
      import('swagger-ui-dist/swagger-ui-bundle.js'),
      import('swagger-ui-dist/swagger-ui.css'),
    ])
      .then(([bundle]) => {
        if (!active) {
          return;
        }
        container.innerHTML = '';
        bundle.default({
          domNode: container,
          url: rawUrl(specPath),
          deepLinking: false,
          docExpansion: 'list',
          defaultModelsExpandDepth: 0,
          displayRequestDuration: true,
          filter: true,
          supportedSubmitMethods: [],
        });
        setStatus('ready');
      })
      .catch(() => {
        if (active) {
          setStatus('error');
        }
      });
    return () => {
      active = false;
      container.innerHTML = '';
    };
  }, [specPath]);

  return (
    <div className="api-explorer">
      <div className="api-toolbar">
        <div>
          <strong>Contrato OpenAPI</strong>
          <p>
            Endpoints, permisos, esquemas y errores del servicio. Las peticiones de prueba están desactivadas porque
            la API real solo acepta llamadas autenticadas a través del API Gateway.
          </p>
        </div>
        <div className="api-toolbar-actions">
          {specs.length > 1 && (
            <select value={specPath} onChange={(event) => setSelected(event.target.value)} aria-label="Contrato">
              {specs.map((spec) => (
                <option key={spec} value={spec}>{fileName(spec)}</option>
              ))}
            </select>
          )}
          <a className="chip-button" href={blobUrl(specPath)} target="_blank" rel="noreferrer">
            <Icon name="github" />
            {fileName(specPath)}
          </a>
        </div>
      </div>
      {status === 'loading' && <StatusMessage kind="loading">Cargando el explorador de la API…</StatusMessage>}
      {status === 'error' && (
        <StatusMessage kind="error">No fue posible cargar el explorador de la API.</StatusMessage>
      )}
      <div className="swagger-host" ref={containerRef} />
    </div>
  );
}
