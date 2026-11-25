import { Icon } from '../../../shared/components/Icons';
import { SERVICES } from '../../../shared/data/services';
import { TEAM } from '../../../shared/data/team';
import { documentationHref, sectionHref } from '../../../shared/services/router';
import type { LoadStatus } from '../../../shared/types';
import { isApiSpec, isDiagram, isMarkdown } from '../../../shared/utils/documentation';

interface HeroSectionProps {
  tree: { status: LoadStatus; paths: string[] };
}

/**
 * Formats a live count, showing a dash until it is known
 * @param status loading state of the repository tree
 * @param count number of files found
 * @returns the text of the count
 */
function liveCount(status: LoadStatus, count: number): string {
  if (status !== 'ready') {
    return '—';
  }
  return String(count);
}

/**
 * First screen of the site: what CampusSeguro is, with live figures of its documentation
 * @param props files of the documentation repository
 * @returns the hero section
 */
export function HeroSection({ tree }: HeroSectionProps) {
  const microservices = SERVICES.filter((service) => service.code.startsWith('MS')).length;
  const diagrams = tree.paths.filter(isDiagram).length;
  const contracts = tree.paths.filter(isApiSpec).length;
  const documents = tree.paths.filter(isMarkdown).length;

  const stats = [
    { value: String(microservices), label: 'Microservicios' },
    { value: '1', label: 'API Gateway' },
    { value: liveCount(tree.status, contracts), label: 'Contratos de API', live: true },
    { value: liveCount(tree.status, diagrams), label: 'Diagramas', live: true },
    { value: liveCount(tree.status, documents), label: 'Documentos', live: true },
    { value: String(TEAM.length), label: 'Integrantes' },
  ];

  return (
    <section className="hero" id="inicio">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow eyebrow-light">DOSW 2026-2 · Escuela Colombiana de Ingeniería</span>
          <h1>
            CampusSeguro
            <span>Prevención y respuesta a emergencias en el campus</span>
          </h1>
          <p className="hero-lead">
            Una plataforma de microservicios que acompaña a la comunidad universitaria antes, durante y después de
            una emergencia o un simulacro: alertas, rutas de evacuación, reporte de estado, brigadistas, formación y
            analítica, todo en un mismo sistema.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={sectionHref('funcionalidades')}>
              Explorar funcionalidades
              <Icon name="arrow-right" />
            </a>
            <a className="button button-ghost" href={documentationHref()}>
              Ver documentación
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}campus.jpg`} alt="" />
          <div className="float-card float-card-top">
            <span className="code-tag" style={{ background: '#C2410C' }}>MS03</span>
            <div>
              <strong>Simulacro en curso</strong>
              <small>Alerta enviada a la comunidad</small>
            </div>
          </div>
          <div className="float-card float-card-bottom">
            <span className="float-check">
              <Icon name="shield" />
            </span>
            <div>
              <strong>Estoy a salvo</strong>
              <small>Reporte en el punto de encuentro</small>
            </div>
          </div>
        </div>
      </div>
      <dl className="hero-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="hero-stat">
            <dt>
              {stat.label}
              {stat.live && <span className="live-dot" title="Dato en vivo desde el repositorio de documentación" />}
            </dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
