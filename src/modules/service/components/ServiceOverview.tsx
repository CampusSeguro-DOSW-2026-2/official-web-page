import { Icon } from '../../../shared/components/Icons';
import { serviceHref } from '../../../shared/services/router';
import type { ServiceInfo } from '../../../shared/types';

interface ServiceOverviewProps {
  service: ServiceInfo;
  counts: { documents: number; diagrams: number; specs: number };
  ready: boolean;
}

/**
 * Summary of a service written for people outside the project
 * @param props service, number of documents of each kind and whether they are already counted
 * @returns the overview tab
 */
export function ServiceOverview({ service, counts, ready }: ServiceOverviewProps) {
  const shortcuts = [
    { tab: 'documentos', label: 'Documentos', count: counts.documents, icon: 'file' as const },
    { tab: 'diagramas', label: 'Diagramas', count: counts.diagrams, icon: 'image' as const },
    { tab: 'api', label: 'Contratos de API', count: counts.specs, icon: 'code' as const },
  ];

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
          <ul className="shortcut-list">
            {shortcuts.map((shortcut) => {
              let count = '—';
              if (ready) {
                count = String(shortcut.count);
              }
              return (
                <li key={shortcut.tab}>
                  <a href={serviceHref(service.slug, shortcut.tab)}>
                    <Icon name={shortcut.icon} />
                    <span>{shortcut.label}</span>
                    <strong>{count}</strong>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}
