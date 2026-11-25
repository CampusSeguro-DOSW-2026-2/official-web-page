import { Icon, type IconName } from '../../../shared/components/Icons';
import { SectionHeading } from './SectionHeading';

const PIPELINE = [
  {
    label: 'Rama de trabajo',
    detail: 'feature/* · fix/*',
    text: 'Cada requisito o corrección se desarrolla en su propia rama.',
  },
  {
    label: 'Pull request',
    detail: 'hacia develop',
    text: 'Revisión del código, pruebas automáticas, cobertura con JaCoCo y análisis con SonarCloud.',
  },
  {
    label: 'Entorno de prueba',
    detail: 'develop',
    text: 'Al integrar el cambio se despliega automáticamente al entorno de prueba.',
  },
  {
    label: 'Producción',
    detail: 'main',
    text: 'El paso a producción se lanza manualmente desde main, cuando el equipo lo aprueba.',
  },
];

const INFRASTRUCTURE: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'layers',
    title: 'Contenedores',
    text: 'Cada servicio y su base de datos corren en contenedores Docker orquestados con Docker Compose.',
  },
  {
    icon: 'globe',
    title: 'Dos nubes',
    text: 'Los servicios se despliegan en máquinas virtuales de AWS y de Azure.',
  },
  {
    icon: 'shield',
    title: 'Borde seguro',
    text: 'Caddy recibe el tráfico en cada máquina, con HTTPS y certificados renovados automáticamente.',
  },
  {
    icon: 'lock',
    title: 'Confianza mutua',
    text: 'Entre el Gateway y cada servicio la conexión exige certificado de cliente (mTLS).',
  },
  {
    icon: 'code',
    title: 'Integración continua',
    text: 'GitHub Actions construye, prueba y despliega con runners propios en cada máquina.',
  },
  {
    icon: 'file',
    title: 'Esta página',
    text: 'Publicada en GitHub Pages; su documentación se lee en vivo desde el repositorio del proyecto.',
  },
];

/**
 * How changes travel from a branch to production and where the system runs
 * @returns the delivery section
 */
export function DeliverySection() {
  return (
    <section className="section section-tinted" id="despliegue">
      <div className="section-inner">
        <SectionHeading eyebrow="Despliegue" title="Del código a producción">
          Un mismo flujo para todos los servicios: ningún cambio llega a producción sin pasar por revisión, pruebas
          y un entorno de prueba.
        </SectionHeading>

        <ol className="pipeline">
          {PIPELINE.map((stage, index) => (
            <li key={stage.label} className="pipeline-stage">
              <span className="pipeline-number">{index + 1}</span>
              <strong>{stage.label}</strong>
              <code>{stage.detail}</code>
              <p>{stage.text}</p>
            </li>
          ))}
        </ol>

        <div className="infra-grid">
          {INFRASTRUCTURE.map((item) => (
            <div key={item.title} className="infra-card">
              <span className="infra-icon">
                <Icon name={item.icon} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
