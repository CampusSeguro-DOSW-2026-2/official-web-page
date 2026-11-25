import { useEffect, useState } from 'react';
import { fetchDocumentationTree } from '../services/github';
import type { LoadStatus } from '../types';

interface TreeState {
  status: LoadStatus;
  paths: string[];
}

/**
 * Loads the list of files of the documentation repository
 * @returns the loading state and the paths of the files
 */
export function useDocumentationTree(): TreeState {
  const [state, setState] = useState<TreeState>({ status: 'loading', paths: [] });

  useEffect(() => {
    let active = true;
    fetchDocumentationTree()
      .then((paths) => {
        if (active) {
          setState({ status: 'ready', paths });
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', paths: [] });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
