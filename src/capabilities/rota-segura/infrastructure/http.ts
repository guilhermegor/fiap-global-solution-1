import { SETTINGS } from './config';

/**
 * `fetch` + JSON parse with a hard timeout, so a slow or dead external API
 * can never hang the UI. Throws on non-2xx or timeout; callers translate
 * the failure into an offline fallback or a user-facing message.
 */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SETTINGS.requestTimeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
