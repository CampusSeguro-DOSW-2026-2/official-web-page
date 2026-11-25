# CampusSeguro — Página oficial

Página de presentación técnica y tecnológica de **CampusSeguro**, la plataforma de microservicios para la gestión de emergencias, evacuaciones y simulacros en el campus de la Escuela Colombiana de Ingeniería Julio Garavito (curso DOSW 2026-2).

Está pensada para un público que no participó en el desarrollo: explica qué hace el sistema, cómo está construido, con qué tecnologías y cómo se despliega, y reúne la documentación de cada servicio.

**Sitio publicado:** <https://campusseguro-dosw-2026-2.github.io/official-web-page/>

## Qué contiene

| Página | Ruta | Contenido |
|---|---|---|
| Inicio | `#/` | Presentación en una sola página: qué es CampusSeguro, funcionalidades, arquitectura, tecnologías, despliegue y equipo. |
| Sección del inicio | `#/seccion/<id>` | Enlace directo a una sección: `funcionalidades`, `arquitectura`, `tecnologias`, `despliegue` o `equipo`. |
| Servicio | `#/servicios/<servicio>` | Página del API Gateway (`gateway`) o de un microservicio (`ms01` a `ms08`) con cuatro pestañas: Resumen, Documentos, Diagramas y API. |
| Documento de un servicio | `#/servicios/<servicio>/documentos/<archivo>` | Un documento de la carpeta del servicio en el repositorio de documentación. |
| Documentación general | `#/documentacion` | Documentos comunes a todos los servicios: estándares de integración, matriz de roles y permisos, catálogo de auditoría y conexión al API Gateway, más los diagramas de arquitectura del sistema. |

En las páginas de servicio:

* **Resumen:** descripción del servicio, sus funcionalidades principales y sus tecnologías.
* **Documentos:** los archivos Markdown de la carpeta del servicio, con índice lateral. Los enlaces entre documentos se abren dentro del sitio y los archivos PDF o Word se ofrecen para descargar.
* **Diagramas:** las imágenes (`.svg`, `.png`, `.jpg`) de la carpeta `diagrams/` o `diagramas/` del servicio, con un visor a pantalla completa. Los diagramas que solo existen en `.puml` o `.drawio` no se muestran hasta que se exporten a `.svg`.
* **API:** Swagger UI interactivo sobre el contrato OpenAPI de la carpeta `api/` del servicio. Las peticiones de prueba están desactivadas, porque la API real solo acepta llamadas autenticadas a través del API Gateway.

## Documentación en vivo

La página no copia la documentación: la lee en el navegador desde el repositorio público [`documentation`](https://github.com/CampusSeguro-DOSW-2026-2/documentation), rama `main`. Cualquier cambio que se integre allí se ve en la página sin volver a desplegarla.

* La **lista de archivos** se obtiene de la API de GitHub (`git/trees/main?recursive=1`). Con ella se decide qué documentos, diagramas y contratos tiene cada servicio, de modo que un archivo nuevo aparece solo.
* El **contenido** de cada archivo se descarga de `raw.githubusercontent.com`. GitHub guarda ese contenido en caché unos minutos, así que un cambio puede tardar hasta cinco minutos en verse.
* Las cifras del inicio marcadas con un punto verde (contratos de API, diagramas y documentos) se calculan en vivo con esa misma lista.

### Resiliencia

La API de GitHub permite 60 consultas por hora por dirección IP, y en una presentación muchos visitantes pueden compartir la misma red. Para que la página siga funcionando:

1. La lista de archivos se guarda en el navegador durante cinco minutos y se reutiliza en cada página de la visita.
2. Si GitHub no responde, se usa la última lista guardada en ese navegador.
3. Si no hay ninguna guardada, se usa `documentation-tree.json`, una copia de la lista que el flujo de despliegue publica junto con el sitio y que se renueva cada día.

## Tecnologías

* React 19 + TypeScript + Vite
* `react-markdown` con `remark-gfm`, `rehype-raw`, `rehype-sanitize` y `rehype-slug` para mostrar los documentos
* `swagger-ui-dist` para el explorador de la API
* GitHub Pages y GitHub Actions para el despliegue

Para que la primera carga sea liviana, el visor de documentos y Swagger UI se descargan solo cuando se abren.

## Estructura

Sigue la organización del [frontend del proyecto](https://github.com/CampusSeguro-DOSW-2026-2/frontend), con un módulo por página en lugar de uno por microservicio:

```
src/
├── app/                        # Arranque, barra de navegación, pie de página y enrutado
│   ├── main.tsx
│   └── App.tsx
│
├── shared/                     # Reutilizable por todas las páginas
│   ├── components/             # Navbar, Footer, MarkdownView, DocumentBrowser, DiagramGallery, Icons…
│   ├── data/                   # Catálogo de servicios, equipo y tecnologías
│   ├── hooks/                  # useRoute, useDocumentationTree, useFileText
│   ├── services/               # github.ts (lectura del repositorio) y router.ts (rutas por hash)
│   ├── utils/                  # Clasificación y títulos de los archivos de documentación
│   ├── styles.css              # Paleta, tipografía y estilos generales
│   └── types.ts
│
└── modules/
    ├── home/                   # Página de inicio y sus secciones
    ├── service/                # Página de cada servicio y explorador de la API
    └── documentation/          # Documentación general
```

Cada módulo tiene `pages/`, `components/` (si los necesita), `styles/` y `routes.tsx`. `app/App.tsx` solo encadena las funciones de rutas de los módulos.

## Ejecutar en local

Requisitos: Node.js 22 o superior.

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # verificación de tipos y compilación en dist/
npm run preview    # sirve la compilación de dist/
npm run lint       # análisis con oxlint
```

El sitio se sirve bajo la ruta `/official-web-page/` (por ejemplo, `http://localhost:5173/official-web-page/`), igual que en GitHub Pages. Esa ruta se define en `base` de `vite.config.js`.

## Despliegue

El flujo `.github/workflows/deploy.yml` compila el sitio y lo publica en GitHub Pages:

* en cada push a `main`;
* todos los días a las 06:00 UTC, para renovar la copia de respaldo `documentation-tree.json`;
* a mano, desde la pestaña **Actions** (*Run workflow*).

Para que funcione, el repositorio debe tener GitHub Pages configurado en **Settings → Pages → Source: GitHub Actions**.

## Cómo actualizar el contenido

La documentación de cada servicio se cambia en el repositorio [`documentation`](https://github.com/CampusSeguro-DOSW-2026-2/documentation), no aquí. En este repositorio solo vive el texto de presentación:

| Qué | Dónde |
|---|---|
| Nombre, descripción, funcionalidades, tecnologías y color de cada servicio, y su carpeta en `documentation` | `src/shared/data/services.ts` |
| Integrantes del equipo | `src/shared/data/team.ts` |
| Tecnologías por capa | `src/shared/data/technologies.ts` |
| Títulos de los documentos y de los diagramas según su nombre de archivo | `src/shared/utils/documentation.ts` |
| Textos de las secciones del inicio | `src/modules/home/components/` |
| Colores y tipografía | `src/shared/styles.css` |

Para que un diagrama aparezca en la página basta con agregarlo en formato `.svg`, `.png` o `.jpg` a la carpeta `diagrams/` del servicio en `documentation`. Los diagramas de todo el sistema van en `integration/architecture/` y se muestran en el inicio y en la documentación general.
