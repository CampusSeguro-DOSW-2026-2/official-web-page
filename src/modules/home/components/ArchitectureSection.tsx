import { DiagramGallery } from '../../../shared/components/DiagramGallery';
import { Icon, type IconName } from '../../../shared/components/Icons';
import { SERVICES } from '../../../shared/data/services';
import { documentationHref, serviceHref } from '../../../shared/services/router';
import type { LoadStatus } from '../../../shared/types';
import { ARCHITECTURE_FOLDER, isImage } from '../../../shared/utils/documentation';
import { SectionHeading } from './SectionHeading';

interface ArchitectureSectionProps {
  tree: { status: LoadStatus; paths: string[] };
}

const REQUEST_STEPS = [
  {
    title: 'La persona inicia sesión',
    text: 'MS01 verifica sus credenciales y le entrega un token firmado digitalmente con sus roles y permisos.',
  },
  {
    title: 'Toda petición entra por el Gateway',
    text: 'El API Gateway comprueba la firma y la vigencia del token antes de dejar pasar la solicitud.',
  },
  {
    title: 'El Gateway informa quién llama',
    text: 'Reenvía al microservicio la identidad y los permisos de la persona; nadie puede suplantarlos desde fuera.',
  },
  {
    title: 'El microservicio decide',
    text: 'Cada servicio autoriza la acción según los permisos y responde con un formato de error común.',
  },
  {
    title: 'Todo queda registrado',
    text: 'Las acciones relevantes se envían a MS08 para la auditoría y los indicadores de cada evento.',
  },
];

const PRINCIPLES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'database',
    title: 'Una base de datos por servicio',
    text: 'Cada microservicio es dueño de sus datos; ninguno lee directamente la base de otro.',
  },
  {
    icon: 'shield',
    title: 'Seguridad por permisos',
    text: 'Los roles agrupan permisos con el formato ms<NN>:<recurso>:<acción>, configurables sin cambiar código.',
  },
  {
    icon: 'lock',
    title: 'Comunicación cifrada',
    text: 'El Gateway y los servicios se autentican mutuamente con mTLS; solo el Gateway puede llegar a ellos.',
  },
  {
    icon: 'code',
    title: 'Contratos primero',
    text: 'Cada servicio publica su contrato OpenAPI y los demás equipos se integran a partir de él.',
  },
  {
    icon: 'layers',
    title: 'Trazabilidad de extremo a extremo',
    text: 'Un identificador de correlación acompaña cada petición por todos los servicios que atraviesa.',
  },
  {
    icon: 'globe',
    title: 'Pensado para crecer',
    text: 'Los servicios no guardan estado de sesión, así que pueden ejecutarse en varias instancias.',
  },
];

/**
 * How the system is built: its main figures, a map of its parts, the path of a request, its principles and the live
 * architecture diagrams
 * @param props files of the documentation repository
 * @returns the architecture section
 */
export function ArchitectureSection({ tree }: ArchitectureSectionProps) {
  const microservices = SERVICES.filter((service) => service.code.startsWith('MS'));
  const gateway = SERVICES.find((service) => service.code === 'GW');
  const systemDiagrams = tree.paths
    .filter((path) => path.startsWith(`${ARCHITECTURE_FOLDER}/`) && isImage(path))
    .sort();

  return (
    <section className="section section-dark" id="arquitectura">
      <div className="section-inner">
        <SectionHeading eyebrow="Arquitectura" title="Cómo está construido">
          CampusSeguro está dividido en microservicios: piezas independientes, cada una con una responsabilidad
          clara, que se comunican a través de una única puerta de entrada.
        </SectionHeading>

        <div className="arch-figures">
          <div className="arch-figure">
            <strong>{microservices.length}</strong>
            <div>
              <h3>Microservicios</h3>
              <p>
                Cada uno resuelve una parte del problema, tiene su propia base de datos y se despliega por separado,
                de modo que puede evolucionar sin afectar a los demás.
              </p>
            </div>
          </div>
          <div className="arch-figure">
            <strong>1</strong>
            <div>
              <h3>API Gateway</h3>
              <p>
                Es el único punto de acceso al sistema: por él pasan las peticiones de la aplicación web y también las
                llamadas entre microservicios. Ningún servicio queda expuesto directamente a internet.
              </p>
            </div>
          </div>
        </div>

        <div className="architecture">
          <div className="arch-map" role="img" aria-label={`Mapa de la arquitectura: comunidad, aplicación web, API Gateway y ${microservices.length} microservicios con su base de datos; las llamadas entre microservicios también pasan por el API Gateway`}>
            <div className="arch-layer">
              <span className="arch-node arch-node-soft">
                <Icon name="users" />
                Comunidad del campus
              </span>
            </div>
            <span className="arch-arrow" aria-hidden="true">HTTPS</span>
            <div className="arch-layer">
              <span className="arch-node">
                <Icon name="globe" />
                Aplicación web · React
              </span>
            </div>
            <span className="arch-arrow" aria-hidden="true">JWT</span>
            <div className="arch-layer">
              {gateway && (
                <a className="arch-node arch-node-gateway" href={serviceHref(gateway.slug)}>
                  <Icon name="shield" />
                  API Gateway
                </a>
              )}
            </div>
            <span className="arch-arrow" aria-hidden="true">mTLS</span>
            <div className="arch-services">
              {microservices.map((service) => (
                <a key={service.slug} className="arch-service" href={serviceHref(service.slug)}>
                  <span className="arch-service-code" style={{ background: service.accent }}>{service.code}</span>
                  <span className="arch-service-name">{service.name}</span>
                  <span className="arch-service-db">
                    <Icon name="database" />
                    Base de datos propia
                  </span>
                </a>
              ))}
            </div>
            <p className="arch-internal">
              <span className="arch-internal-route" aria-hidden="true">
                MS
                <Icon name="arrow-right" />
                <span className="arch-internal-gateway">GW</span>
                <Icon name="arrow-right" />
                MS
              </span>
              Las llamadas entre microservicios también pasan por el Gateway, que identifica al servicio que llama
            </p>
            <p className="arch-external">
              Servicios externos: correo electrónico, modelo de lenguaje y OpenStreetMap
            </p>
          </div>

          <div className="arch-steps">
            <h3>El recorrido de una petición</h3>
            <ol>
              {REQUEST_STEPS.map((step, index) => (
                <li key={step.title}>
                  <span className="step-number">{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="principles">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title} className="principle">
              <Icon name={principle.icon} />
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </div>
          ))}
        </div>

        {systemDiagrams.length > 0 && (
          <div className="arch-diagrams">
            <h3>Diagramas del sistema</h3>
            <DiagramGallery paths={systemDiagrams} />
          </div>
        )}

        <a className="button button-light" href={documentationHref()}>
          Estándares, permisos y auditoría en detalle
          <Icon name="arrow-right" />
        </a>
      </div>
    </section>
  );
}
