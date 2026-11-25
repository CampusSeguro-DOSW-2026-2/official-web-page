import { useEffect, useState } from 'react';
import { readRoute } from '../services/router';
import type { Route } from '../types';

/**
 * Keeps the current route in sync with the URL hash and moves to the top when the page changes
 * @returns the current route
 */
export function useRoute(): Route {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute());
    };
    window.addEventListener('hashchange', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
    };
  }, []);

  // A new page starts at the top; tabs and documents of the same page keep the position,
  // and home sections scroll on their own
  const isSection = route.segments[0] === 'seccion';
  const pageKey = route.segments.slice(0, 2).join('/');
  useEffect(() => {
    if (!isSection) {
      window.scrollTo({ top: 0 });
    }
  }, [pageKey, isSection]);

  return route;
}
