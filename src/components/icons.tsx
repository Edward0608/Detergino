import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function IconSearch(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
/** The offer list: a shopping basket with list lines inside, so it reads as "cart" at a glance and as "list" on a second look. */
export function IconList(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...base} {...props}>
      <path d="M3.5 9.5h17l-1.55 8.9a1.6 1.6 0 0 1-1.58 1.35H6.63a1.6 1.6 0 0 1-1.58-1.35L3.5 9.5Z" />
      <path d="m8.6 9.5 2.3-5.2M15.4 9.5l-2.3-5.2" />
      <path d="M8.3 13.2h7.4M9 16.3h6" />
    </svg>
  );
}
export function IconPin(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
export function IconHelp(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8M12 17h.01" />
    </svg>
  );
}
export function IconPhone(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...base} {...props}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
export function IconWhatsApp(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.73 2.64 4.2 3.7.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}
export function IconChevron(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
export function IconChevronDown(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
export function IconClose(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
export function IconMenu(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function IconPlus(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function IconMinus(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}
export function IconCheck(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}
export function IconPause(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor" {...props}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
export function IconPlay(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M8 5.5v13l10-6.5z" />
    </svg>
  );
}
export function IconMail(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}
export function IconTrash(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </svg>
  );
}
export function IconImageOff(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 17 5-5 4 4 3-3 6 6" />
      <circle cx="16" cy="9" r="1.5" />
    </svg>
  );
}
export function IconBox(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" {...base} {...props}>
      <path d="M3 8.5 12 4l9 4.5v8L12 21l-9-4.5v-8Z" />
      <path d="M3 8.5 12 13l9-4.5M12 13v8" />
    </svg>
  );
}
export function IconPallet(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" {...base} {...props}>
      <rect x="4" y="5" width="7" height="6" />
      <rect x="13" y="5" width="7" height="6" />
      <rect x="8.5" y="11" width="7" height="6" />
      <path d="M3 20h18M5 17v3M12 17v3M19 17v3" />
    </svg>
  );
}
export function IconLink(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5" />
    </svg>
  );
}
export function IconFacebook(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3Z" />
    </svg>
  );
}
export function IconFile(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}
