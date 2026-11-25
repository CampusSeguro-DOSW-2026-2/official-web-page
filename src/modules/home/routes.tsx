import type { Route } from '../../shared/types';
import { Home } from './pages/Home';

/**
 * Routes of the home page: the root and each of its sections
 * @param route current route
 * @returns the home page, or undefined when the route belongs to another module
 */
export function homeRoutes(route: Route) {
  if (route.path === '/' || route.segments[0] === 'seccion') {
    return <Home section={route.segments[1]} />;
  }
  return undefined;
}
