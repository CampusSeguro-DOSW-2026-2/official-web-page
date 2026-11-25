import type { TechnologyGroup } from '../types';

/** Technologies of the project grouped by layer */
export const TECHNOLOGY_GROUPS: TechnologyGroup[] = [
  {
    title: 'Backend',
    description: 'Ocho microservicios independientes con la misma base tecnológica.',
    items: ['Java 21', 'Spring Boot 4.1', 'Spring Security', 'Spring Data JPA', 'Jakarta', 'Maven'],
  },
  {
    title: 'API Gateway',
    description: 'Entrada única, reactiva y segura.',
    items: ['Spring Cloud Gateway', 'WebFlux', 'JWT RS256', 'Nimbus JOSE + JWT'],
  },
  {
    title: 'Datos',
    description: 'Cada microservicio es dueño de su propia base de datos.',
    items: ['PostgreSQL 17', 'MongoDB', 'Amazon DocumentDB', 'Flyway', 'Scripts SQL versionados', 'Azure Blob Storage'],
  },
  {
    title: 'Frontend',
    description: 'Una sola aplicación web para todos los módulos.',
    items: ['React 19', 'TypeScript', 'Vite', 'Leaflet', 'OpenStreetMap'],
  },
  {
    title: 'Calidad',
    description: 'Pruebas automáticas y análisis en cada cambio.',
    items: ['JUnit 5', 'Mockito', 'MockMvc', 'WireMock', 'JaCoCo', 'SonarCloud', 'k6'],
  },
  {
    title: 'Infraestructura',
    description: 'Contenedores desplegados en dos nubes.',
    items: ['Docker', 'Docker Compose', 'Caddy', 'mTLS', 'AWS EC2', 'Azure', 'GitHub Actions'],
  },
  {
    title: 'Inteligencia artificial',
    description: 'Asistente para la formación preventiva.',
    items: ['Modelo de lenguaje', 'API compatible con OpenAI'],
  },
  {
    title: 'Documentación',
    description: 'Contratos y diagramas versionados junto al código.',
    items: ['OpenAPI 3', 'Swagger UI', 'Modelo C4', 'UML', 'draw.io', 'PlantUML'],
  },
];
