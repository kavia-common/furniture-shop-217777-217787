import { environment } from '../../environments/environment';

export type ThemeConfig = typeof environment.THEME;

// PUBLIC_INTERFACE
export function getApiBaseUrl(): string {
  /** Returns the base URL for the backend FastAPI service. Reads from environment, with optional runtime override via window. */
  try {
    const w: any = (globalThis as any);
    if (w && typeof w.FURNITURE_API_BASE_URL === 'string' && w.FURNITURE_API_BASE_URL.length > 0) {
      return w.FURNITURE_API_BASE_URL;
    }
  } catch {
    // ignore, use default
  }
  return environment.API_BASE_URL;
}

// PUBLIC_INTERFACE
export function getTheme(): ThemeConfig {
  /** Returns the Ocean Professional theme config. */
  return environment.THEME;
}
