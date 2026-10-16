/**
 * Utility to resolve asset URLs and screen route navigation compatible with relative Vite base ('./')
 * and subpath hosting (e.g. GitHub Pages /where-did-my-button-go/).
 */

export function getAssetPath(path: string): string {
  const base = import.meta.env.BASE_URL || './';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}

export function getScreenUrl(screenQuery: string): string {
  const base = import.meta.env.BASE_URL || './';
  const cleanQuery = screenQuery.startsWith('?') ? screenQuery : `?${screenQuery}`;
  return `${base}${cleanQuery}`;
}
