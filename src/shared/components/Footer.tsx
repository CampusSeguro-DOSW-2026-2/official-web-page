import { SERVICES } from '../data/services';
import { DOCUMENTATION_REPOSITORY_URL, ORGANIZATION_URL } from '../services/github';
import { documentationHref, serviceHref } from '../services/router';
import { Icon } from './Icons';

/**
 * Footer with the course, the services and the repositories of the project
 * @returns the footer of every page
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" />
            <span>CampusSeguro</span>
          </div>
          <p>
            Proyecto del curso Desarrollo y Operaciones de Software (DOSW) 2026-2 de la Escuela Colombiana de
            Ingeniería Julio Garavito.
          </p>
        </div>
        <div className="footer-column">
          <span className="footer-title">Servicios</span>
          <ul>
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <a href={serviceHref(service.slug)}>{service.code} · {service.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <span className="footer-title">Recursos</span>
          <ul>
            <li>
              <a href={documentationHref()}>Documentación general</a>
            </li>
            <li>
              <a href={DOCUMENTATION_REPOSITORY_URL} target="_blank" rel="noreferrer">
                Repositorio de documentación <Icon name="external" />
              </a>
            </li>
            <li>
              <a href={ORGANIZATION_URL} target="_blank" rel="noreferrer">
                Organización en GitHub <Icon name="external" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-note">
        La documentación de esta página se lee en vivo desde el repositorio de documentación del proyecto.
      </div>
    </footer>
  );
}
