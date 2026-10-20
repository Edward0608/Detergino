/** Plausible-compatible custom events. No-op until NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set and the script is loaded. */
export const ANALYTICS_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "";

type Props = Record<string, string | number>;

export function track(event: string, props?: Props): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { plausible?: (e: string, o?: { props?: Props }) => void };
  try {
    w.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* analytics must never break the page */
  }
}
