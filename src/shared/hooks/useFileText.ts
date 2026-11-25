import { useEffect, useState } from 'react';
import { fetchFileText } from '../services/github';
import type { LoadStatus } from '../types';

interface FileState {
  status: LoadStatus;
  path: string;
  text: string;
}

/**
 * Loads the text of a file of the documentation repository
 * @param path file path inside the repository
 * @returns the loading state and the text of the file
 */
export function useFileText(path: string): FileState {
  const [state, setState] = useState<FileState>({ status: 'loading', path, text: '' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', path, text: '' });
    fetchFileText(path)
      .then((text) => {
        if (active) {
          setState({ status: 'ready', path, text });
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', path, text: '' });
        }
      });
    return () => {
      active = false;
    };
  }, [path]);

  // A state left from the previous file is never shown for the new one
  if (state.path !== path) {
    return { status: 'loading', path, text: '' };
  }
  return state;
}
