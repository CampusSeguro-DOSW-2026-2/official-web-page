import { useEffect, useState } from 'react';
import { fetchFileText } from '../services/github';
import type { LoadStatus } from '../types';
import { countOperations } from '../utils/documentation';

interface OperationCounts {
  status: LoadStatus;
  counts: Record<string, number>;
}

interface OperationCountsState extends OperationCounts {
  key: string;
}

/**
 * Downloads the OpenAPI contracts of a service and counts the endpoints of each one
 * @param specs paths of the contracts inside the documentation repository
 * @returns the loading state and the number of endpoints by contract path
 */
export function useOperationCounts(specs: string[]): OperationCounts {
  const key = specs.join('\n');
  const [state, setState] = useState<OperationCountsState>({ key: '', status: 'loading', counts: {} });

  useEffect(() => {
    if (key.length === 0) {
      return undefined;
    }
    let active = true;
    const paths = key.split('\n');
    Promise.all(paths.map((path) => fetchFileText(path)
      .then((text) => [path, countOperations(text)] as const)))
      .then((entries) => {
        if (active) {
          setState({ key, status: 'ready', counts: Object.fromEntries(entries) });
        }
      })
      .catch(() => {
        if (active) {
          setState({ key, status: 'error', counts: {} });
        }
      });
    return () => {
      active = false;
    };
  }, [key]);

  if (key.length === 0) {
    return { status: 'ready', counts: {} };
  }
  // A state left from other contracts is never shown for the current ones
  if (state.key !== key) {
    return { status: 'loading', counts: {} };
  }
  return { status: state.status, counts: state.counts };
}
