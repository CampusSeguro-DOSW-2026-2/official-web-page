import type { ReactNode } from 'react';

interface StatusMessageProps {
  kind: 'loading' | 'error' | 'empty';
  children: ReactNode;
}

/**
 * Shows the state of content that is still loading, failed or does not exist
 * @param props kind of state and message
 * @returns the status box
 */
export function StatusMessage({ kind, children }: StatusMessageProps) {
  let role: 'status' | 'alert' = 'status';
  if (kind === 'error') {
    role = 'alert';
  }
  return (
    <div className={`status status-${kind}`} role={role}>
      {kind === 'loading' && <span className="spinner" aria-hidden="true" />}
      <span>{children}</span>
    </div>
  );
}
