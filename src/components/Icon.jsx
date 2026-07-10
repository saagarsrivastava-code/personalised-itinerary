// Lightweight stroke icon set. Inherits color via currentColor.
const PATHS = {
  back: <path d="M15 5l-7 7 7 7" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  share: <><circle cx="6" cy="12" r="2.4" /><circle cx="17" cy="6" r="2.4" /><circle cx="17" cy="18" r="2.4" /><path d="M8.1 11l6.8-3.6M8.1 13l6.8 3.6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 13l4 4L19 7" />,
  upload: <><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" /><path d="M5 20h14" /></>,
  walk: <><circle cx="13" cy="4.5" r="1.6" /><path d="M11 21l1.5-5 2-2-1-4-3 2-1 3M14 14l3 3 1 4M11 9l-3 1" /></>,
  metro: <><rect x="6" y="4" width="12" height="13" rx="3" /><path d="M6 12h12M9 21l-1.5-2M15 21l1.5-2" /><circle cx="9" cy="14.5" r="0.6" fill="currentColor" stroke="none" /><circle cx="15" cy="14.5" r="0.6" fill="currentColor" stroke="none" /></>,
  car: <><path d="M4 13l1.5-4.5A2 2 0 017.4 7h9.2a2 2 0 011.9 1.5L20 13v5h-3v-2H7v2H4z" /><circle cx="7.5" cy="15.5" r="0.7" fill="currentColor" stroke="none" /><circle cx="16.5" cy="15.5" r="0.7" fill="currentColor" stroke="none" /></>,
  pencil: <path d="M4 20h4L18.5 9.5a2 2 0 000-3l-1-1a2 2 0 00-3 0L4 16v4z" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  warning: <><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17v.5" /></>,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  pin: <><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  route: <><circle cx="6" cy="6" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M6 8.2v4.3a3.5 3.5 0 003.5 3.5H14M18 15.8V12" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4.5l3 2" /></>,
  home: <><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></>,
  list: <><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  user: <><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0113 0" /></>,
  doc: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9 13h6M9 16h6" /></>,
  phone: <path d="M5 4h3l1.6 4.2-2 1.4a11 11 0 005 5l1.4-2 4.2 1.6V19a2 2 0 01-2.2 2A15 15 0 013 6.2 2 2 0 015 4z" />,
  chat: <path d="M4.5 5.5h15v9.5h-9.5L5.5 19v-3.5h-1z" />,
  send: <path d="M4 12l16-7-7 16-2.5-6.5L4 12z" />,
  mic: <><rect x="9.5" y="3.5" width="5" height="10" rx="2.5" /><path d="M6 11a6 6 0 0012 0M12 17v3.5" /></>,
  speaker: <><path d="M4 9h3l4-3.5v13L7 15H4z" /><path d="M15 9a4 4 0 010 6" /></>,
  image: <><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M5 17l4.5-4 3 2.5L16 11l3 3.5" /></>,
  wallet: <><rect x="3" y="7" width="18" height="12" rx="2" /><path d="M3 10h18" /><circle cx="16" cy="14.5" r="1" fill="currentColor" stroke="none" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
  heart: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 5.5 5.5 5.5 0 0121.5 12c-2.5 4.5-9.5 9-9.5 9z" />,
  link: <><path d="M10.2 13.8a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1.5 1.5" /><path d="M13.8 10.2a4 4 0 00-5.66 0l-3 3a4 4 0 105.66 5.66l1.5-1.5" /></>,
  play: <><circle cx="12" cy="12" r="8.5" /><path d="M10.2 9l4.6 3-4.6 3z" /></>,
  reel: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><path d="M4 8.5h16M8.5 4l2.5 4.5M13.5 4L16 8.5" /><path d="M10.5 12.5l3.5 2.2-3.5 2.2z" /></>,
  screenshot: <><path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" /><circle cx="12" cy="12" r="2.6" /></>,
  bolt: <path d="M13 3L5.5 13.5H11L10.5 21 18 10.5h-5.5z" />,
  lock: <><rect x="5.5" y="11" width="13" height="9" rx="2.5" /><path d="M8.5 11V8a3.5 3.5 0 017 0v3" /></>,
  bell: <><path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 004 0" /></>,
  shield: <><path d="M12 3l7 3v5c0 4.4-3 7.5-7 9-4-1.5-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
}

export default function Icon({ name, size = 22, stroke = 1.8, className, style }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  )
}
