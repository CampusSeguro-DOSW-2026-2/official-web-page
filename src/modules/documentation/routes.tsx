import type { Route } from '../../shared/types';
import { DocumentationPage } from './pages/DocumentationPage';

/**
 * Routes of the general documentation: #/documentacion/<document>
 * @param route current route
 * @returns the documentation page, or undefined when the route belongs to another module
 */
export function documentationRoutes(route: Route) {
  if (route.segments[0] !== 'documentacion') {
    return undefined;
  }
  return (
    <DocumentationPage
      documentPath={route.segments.slice(1).join('/')}
      anchor={route.query.get('ancla')}
    />
  );
}
