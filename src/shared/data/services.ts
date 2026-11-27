import type { ServiceInfo } from '../types';

/** The API Gateway and the eight microservices, in the order they are presented */
export const SERVICES: ServiceInfo[] = [
  {
    slug: 'gateway',
    code: 'GW',
    name: 'API Gateway',
    folder: 'api-gateway',
    tagline: 'La puerta de entrada única y segura a todo el sistema.',
    summary:
      'Recibe todas las peticiones de la aplicación web y de los microservicios, comprueba que quien llama tenga una sesión válida y dirige cada solicitud al servicio correcto. Centraliza la seguridad para que ningún microservicio quede expuesto directamente a internet.',
    highlights: [
      'Verifica la identidad en cada petición con tokens firmados (JWT RS256).',
      'Dirige el tráfico hacia los ocho microservicios según su contrato.',
      'Cifra la comunicación con cada servicio mediante mTLS.',
      'Unifica el formato de los errores y la trazabilidad de cada solicitud.',
    ],
    technologies: ['Spring Cloud Gateway', 'WebFlux', 'Java 21', 'Spring Boot 4.1', 'Nimbus JOSE + JWT', 'Caddy', 'Azure'],
    accent: '#0F172A',
  },
  {
    slug: 'ms01',
    code: 'MS01',
    name: 'Identidad y acceso',
    folder: 'ms01-identity-and-access',
    tagline: 'Cuentas, inicio de sesión, roles y permisos de toda la comunidad.',
    summary:
      'Gestiona el registro con correo institucional, el inicio y el cierre de sesión, el perfil de cada persona y la administración de usuarios. Define qué puede hacer cada rol mediante permisos que el resto del sistema respeta.',
    highlights: [
      'Registro con verificación del correo institucional.',
      'Inicio de sesión con un token firmado que incluye roles y permisos.',
      'Roles y permisos configurables desde la administración.',
      'Cierre inmediato de las sesiones cuando cambian los accesos de una persona.',
    ],
    technologies: ['Java 21', 'Spring Boot 4.1', 'Spring Security', 'Spring Data JPA', 'PostgreSQL 17', 'Spring Mail', 'AWS EC2'],
    accent: '#990000',
  },
  {
    slug: 'ms02',
    code: 'MS02',
    name: 'Campus y seguridad',
    folder: 'ms02-campus-and-security',
    tagline: 'El mapa del campus y las rutas para evacuarlo.',
    summary:
      'Representa el campus completo: edificios, pisos, espacios, salidas, escaleras, zonas seguras y puntos de encuentro. Calcula rutas de evacuación dentro de los edificios y hacia el exterior, y genera códigos QR que cualquier persona puede escanear para consultar la información sin iniciar sesión.',
    highlights: [
      'Inventario del campus: edificios, pisos, espacios, salidas y escaleras.',
      'Rutas de evacuación internas y exteriores sobre OpenStreetMap.',
      'Códigos QR con consulta pública, sin necesidad de cuenta.',
      'Información preventiva e imágenes de cada lugar.',
    ],
    technologies: ['Java 21', 'Spring Boot 4.1', 'PostgreSQL', 'Flyway', 'ZXing', 'OpenStreetMap', 'Azure Blob Storage'],
    accent: '#B45309',
  },
  {
    slug: 'ms03',
    code: 'MS03',
    name: 'Alertas y emergencias',
    folder: 'ms03-alerts-and-emergencies',
    tagline: 'Avisos oportunos para las personas correctas.',
    summary:
      'Permite crear, programar, activar y archivar alertas de emergencia y de simulacro. Notifica por correo a los destinatarios según el alcance de la alerta, y cada persona puede ver sus alertas en una bandeja y confirmar que las recibió.',
    highlights: [
      'Alertas de emergencia y de simulacro con su propio catálogo de tipos.',
      'Programación, activación y archivado de cada alerta.',
      'Notificación por correo a los destinatarios.',
      'Bandeja personal con confirmación de recepción.',
    ],
    technologies: ['Java 21', 'Spring Boot 4.1', 'PostgreSQL', 'Flyway', 'Spring Mail', 'WireMock'],
    accent: '#C2410C',
  },
  {
    slug: 'ms04',
    code: 'MS04',
    name: 'Evacuación y check-in',
    folder: 'ms04-evacuation-and-check-in',
    tagline: 'Saber en tiempo real quién está a salvo.',
    summary:
      'Durante un simulacro o una emergencia, cada persona reporta su estado: a salvo, evacuando, requiere asistencia o fuera del campus. El sistema consolida esos reportes por punto de encuentro, identifica a quienes aún no reportan y envía las solicitudes de ayuda a los brigadistas.',
    highlights: [
      'Check-in habilitado solo mientras el evento está en ejecución.',
      'Tablero consolidado por punto de encuentro.',
      'Personas pendientes y personas que requieren asistencia.',
      'Histórico y resultados de cada evento.',
    ],
    technologies: ['Java 21', 'Spring Boot 4.1', 'Spring Data JPA', 'PostgreSQL 17', 'k6', 'AWS EC2'],
    accent: '#6E0303',
  },
  {
    slug: 'ms05',
    code: 'MS05',
    name: 'Brigadistas e incidentes',
    folder: 'ms05-brigades-and-incidents',
    tagline: 'Organizar la respuesta en el terreno.',
    summary:
      'Activa a los brigadistas y los asigna a edificios, zonas seguras y puntos de encuentro. Registra los incidentes y las solicitudes de asistencia y sigue su atención de principio a fin: reportado, asignado, en atención, resuelto y cerrado.',
    highlights: [
      'Activación y búsqueda de brigadistas.',
      'Asignación por edificio, zona segura o punto de encuentro.',
      'Panel con las responsabilidades de cada brigadista.',
      'Seguimiento de incidentes con historial y evidencias.',
    ],
    technologies: ['Java 21', 'Spring Boot 4.1', 'Spring Data JPA', 'PostgreSQL'],
    accent: '#9F1239',
  },
  {
    slug: 'ms06',
    code: 'MS06',
    name: 'Eventos y simulacros',
    folder: 'ms06-events',
    tagline: 'Planear, ejecutar y evaluar cada simulacro.',
    summary:
      'Permite crear eventos reales y simulacros, definir su alcance (edificios y zonas), sus participantes y sus responsables, programarlos y seguirlos en vivo. Al finalizar entrega una evaluación con los resultados del evento.',
    highlights: [
      'Creación y configuración de eventos y simulacros.',
      'Programación con inicio automático.',
      'Monitoreo en vivo del check-in y de los incidentes.',
      'Evaluación y resultados al finalizar.',
    ],
    technologies: ['Java 21', 'Spring Boot 4.1', 'Spring Data JPA', 'PostgreSQL', 'OAuth2 Resource Server', 'WireMock'],
    accent: '#1D4ED8',
  },
  {
    slug: 'ms07',
    code: 'MS07',
    name: 'Formación y asistente IA',
    folder: 'ms07-training-and-ai-assistant',
    tagline: 'Aprender a actuar antes de que ocurra.',
    summary:
      'Ofrece contenidos de formación preventiva organizados por categorías, evaluaciones cortas y el seguimiento del progreso de cada persona. Incluye el Tutor CampusSeguro, un asistente de inteligencia artificial que resuelve dudas de quien se está formando.',
    highlights: [
      'Contenidos de formación preventiva por categoría.',
      'Evaluaciones cortas.',
      'Seguimiento del progreso de cada persona.',
      'Tutor CampusSeguro con inteligencia artificial.',
    ],
    technologies: ['Java 21', 'Spring Boot 4.1', 'PostgreSQL', 'Flyway', 'Modelo de lenguaje (API compatible con OpenAI)'],
    accent: '#7C3AED',
  },
  {
    slug: 'ms08',
    code: 'MS08',
    name: 'Analítica y auditoría',
    folder: 'ms08-analytics-and-audit',
    tagline: 'Cada acción queda registrada y medida.',
    summary:
      'Recibe de los demás servicios un registro de cada acción relevante y permite consultarlo con filtros. Calcula los indicadores de cada evento o simulacro, compara eventos entre sí y analiza incidentes, asistencia y tiempos de respuesta por edificio o zona.',
    highlights: [
      'Registro central de auditoría de todo el sistema.',
      'Indicadores consolidados de cada evento.',
      'Comparación lado a lado de 2 a 10 eventos.',
      'Analítica de tiempos de respuesta por edificio o zona.',
    ],
    technologies: ['Java 21', 'Spring Boot 4.1', 'Spring Data MongoDB', 'MongoDB', 'Amazon DocumentDB'],
    accent: '#334155',
  },
];

/**
 * Finds a service by its identifier in the routes
 * @param slug identifier of the service
 * @returns the service, or undefined when it does not exist
 */
export function findService(slug: string): ServiceInfo | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

/**
 * Finds the service whose documentation folder contains a file
 * @param path file path inside the documentation repository
 * @returns the service, or undefined when the file is general documentation
 */
export function findServiceByPath(path: string): ServiceInfo | undefined {
  return SERVICES.find((service) => path === service.folder || path.startsWith(`${service.folder}/`));
}
