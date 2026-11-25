import { useCallback, useEffect, useState } from 'react';
import { blobUrl } from '../services/github';
import { diagramTitle, fileName } from '../utils/documentation';
import { Icon } from './Icons';
import { RepositoryImage } from './RepositoryImage';

interface DiagramGalleryProps {
  paths: string[];
}

interface DiagramViewerProps {
  path: string;
  onClose: () => void;
}

/**
 * Shows one diagram over the page, fitted to the screen or at its real size
 * @param props path of the diagram and the action that closes the viewer
 * @returns the full screen viewer
 */
function DiagramViewer({ path, onClose }: DiagramViewerProps) {
  const [realSize, setRealSize] = useState(false);
  const title = diagramTitle(path);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [onClose]);

  let stageClass = 'viewer-stage';
  let sizeLabel = 'Tamaño real';
  if (realSize) {
    stageClass += ' viewer-real';
    sizeLabel = 'Ajustar a la pantalla';
  }

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={title}>
      <div className="viewer-bar">
        <div className="viewer-title">
          <strong>{title}</strong>
          <span>{fileName(path)}</span>
        </div>
        <div className="viewer-actions">
          <button type="button" className="chip-button" onClick={() => setRealSize(!realSize)}>
            <Icon name="zoom" />
            {sizeLabel}
          </button>
          <a className="chip-button" href={blobUrl(path)} target="_blank" rel="noreferrer">
            <Icon name="external" />
            Ver en GitHub
          </a>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>
      </div>
      <div className={stageClass}>
        <RepositoryImage path={path} alt={title} />
      </div>
    </div>
  );
}

/**
 * Shows a grid of diagrams read live from the documentation repository
 * @param props paths of the diagrams
 * @returns the gallery with its viewer
 */
export function DiagramGallery({ paths }: DiagramGalleryProps) {
  const [opened, setOpened] = useState<string | null>(null);
  const close = useCallback(() => {
    setOpened(null);
  }, []);

  return (
    <>
      <div className="diagram-grid">
        {paths.map((path) => (
          <button key={path} type="button" className="diagram-card" onClick={() => setOpened(path)}>
            <span className="diagram-thumb">
              <RepositoryImage path={path} alt={diagramTitle(path)} />
            </span>
            <span className="diagram-caption">
              <strong>{diagramTitle(path)}</strong>
              <small>{fileName(path)}</small>
            </span>
          </button>
        ))}
      </div>
      {opened && <DiagramViewer path={opened} onClose={close} />}
    </>
  );
}
