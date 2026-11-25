import { useEffect, useState } from 'react';
import { fetchSvgUrl, rawUrl } from '../services/github';

interface RepositoryImageProps {
  path: string;
  alt: string;
  className?: string;
}

/**
 * Shows an image stored in the documentation repository, reading SVG files live
 * @param props path of the image, alternative text and optional class
 * @returns the image, or a placeholder while an SVG file loads
 */
export function RepositoryImage({ path, alt, className }: RepositoryImageProps) {
  const isSvg = /\.svg$/i.test(path);
  const [svg, setSvg] = useState<{ path: string; url: string; failed: boolean } | null>(null);

  useEffect(() => {
    if (!isSvg) {
      return;
    }
    let active = true;
    fetchSvgUrl(path)
      .then((url) => {
        if (active) {
          setSvg({ path, url, failed: false });
        }
      })
      .catch(() => {
        if (active) {
          setSvg({ path, url: '', failed: true });
        }
      });
    return () => {
      active = false;
    };
  }, [path, isSvg]);

  if (!isSvg) {
    return <img className={className} src={rawUrl(path)} alt={alt} loading="lazy" />;
  }
  if (!svg || svg.path !== path) {
    return <span className="image-placeholder" role="img" aria-label={`Cargando ${alt}`} />;
  }
  if (svg.failed) {
    return <span className="image-placeholder image-failed">No fue posible cargar la imagen</span>;
  }
  return <img className={className} src={svg.url} alt={alt} loading="lazy" />;
}
