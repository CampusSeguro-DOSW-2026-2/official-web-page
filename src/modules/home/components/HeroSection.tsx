import { Icon } from '../../../shared/components/Icons';
import { documentationHref, sectionHref } from '../../../shared/services/router';

/**
 * First screen of the site: what CampusSeguro is and where to start exploring it
 * @returns the hero section
 */
export function HeroSection() {
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
    </section>
  );
}
