import { Icon } from '../../../shared/components/Icons';
import { SERVICES } from '../../../shared/data/services';
import { serviceHref } from '../../../shared/services/router';
import { SectionHeading } from './SectionHeading';

const MOMENTS = [
  {
    title: 'Antes',
    text: 'La comunidad se forma, el campus y sus rutas de evacuación quedan registrados y los simulacros se planean.',
    services: ['MS07', 'MS02', 'MS06'],
  },
  {
    title: 'Durante',
    text: 'Las alertas llegan a quien corresponde, cada persona reporta su estado y los brigadistas atienden los incidentes.',
    services: ['MS03', 'MS04', 'MS05'],
  },
  {
    title: 'Después',
    text: 'Cada evento deja resultados, indicadores y un registro de auditoría para mejorar el siguiente.',
    services: ['MS06', 'MS08'],
  },
];

/**
 * What the system does: the moments of an emergency and one card per service
 * @returns the features section
 */
export function FeaturesSection() {
  return (
    <section className="section" id="funcionalidades">
      <div className="section-inner">
        <SectionHeading eyebrow="Funcionalidades" title="Todo lo que ocurre en una emergencia, en un solo sistema">
          CampusSeguro reúne en una plataforma las tareas que antes estaban dispersas: avisar, evacuar, saber quién
          está a salvo, coordinar a los brigadistas y aprender de cada simulacro.
        </SectionHeading>

        <ol className="moments">
          {MOMENTS.map((moment, index) => (
            <li key={moment.title} className="moment">
              <span className="moment-step">0{index + 1}</span>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
              <div className="moment-tags">
                {moment.services.map((code) => (
                  <span key={code} className="mono-tag">{code}</span>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="service-grid">
          {SERVICES.map((service) => (
            <a key={service.slug} className="service-card" href={serviceHref(service.slug)}>
              <span className="service-card-bar" style={{ background: service.accent }} />
              <span className="service-card-head">
                <span className="code-tag" style={{ background: service.accent }}>{service.code}</span>
                <Icon name="arrow-right" className="service-card-arrow" />
              </span>
              <h3>{service.name}</h3>
              <p className="service-card-tagline">{service.tagline}</p>
              <ul>
                {service.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <span className="service-card-more">Ver servicio y documentación</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
