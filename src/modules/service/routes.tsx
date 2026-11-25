import { findService } from '../../shared/data/services';
import type { Route } from '../../shared/types';
import { ServicePage } from './pages/ServicePage';

/**
 * Routes of the service pages: #/servicios/<service>/<tab>/<document>
 * @param route current route
 * @returns the page of the service, or undefined when the route belongs to another module
 */
export function serviceRoutes(route: Route) {
  if (route.segments[0] !== 'servicios' || route.segments.length < 2) {
    return undefined;
  }
  const service = findService(route.segments[1]);
  if (!service) {
    return undefined;
  }
  let tab = 'resumen';
  if (route.segments[2]) {
    tab = route.segments[2];
  }
  const documentPath = route.segments.slice(3).join('/');
  return (
    <ServicePage
      key={service.slug}
      service={service}
      tab={tab}
      documentPath={documentPath}
      anchor={route.query.get('ancla')}
    />
  );
}
