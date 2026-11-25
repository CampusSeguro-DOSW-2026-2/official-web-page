import { TECHNOLOGY_GROUPS } from '../../../shared/data/technologies';
import { SectionHeading } from './SectionHeading';

/**
 * Technologies of the project grouped by layer
 * @returns the technology section
 */
export function TechnologySection() {
  return (
    <section className="section" id="tecnologias">
      <div className="section-inner">
        <SectionHeading eyebrow="Tecnologías" title="Especificación tecnológica">
          Todos los microservicios comparten la misma base: Java 21 y Spring Boot 4.1, con PostgreSQL como base de
          datos principal, de modo que cualquier integrante puede moverse entre equipos sin cambiar de herramientas.
        </SectionHeading>
        <div className="tech-grid">
          {TECHNOLOGY_GROUPS.map((group, index) => (
            <div key={group.title} className="tech-group">
              <span className="tech-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <ul className="pill-list">
                {group.items.map((item) => (
                  <li key={item} className="pill">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
