/** Small inline icon set (stroke icons, 24px grid). Decorative by default. */

const paths = {
  phone:
    "M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z",
  text: "M4 5h16v11H9l-5 4V5Zm4 5h.01M12 10h.01M16 10h.01",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  chevL: "m15 5-7 7 7 7",
  chevR: "m9 5 7 7-7 7",
  chevD: "m6 9 6 6 6-6",
  external: "M14 5h5v5m0-5-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2",
  home: "M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8Z",
  map: "M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Zm0 0v14m6-12v14",
  swap: "M7 7h12m0 0-3.5-3.5M19 7l-3.5 3.5M17 17H5m0 0 3.5 3.5M5 17l3.5-3.5",
  filter: "M4 6h16M7 12h10M10 18h4",
  sort: "M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3",
  check: "m5 12.5 4.5 4.5L19 7.5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4",
  gauge: "M4.5 17a8.5 8.5 0 1 1 15 0M12 13l3.5-4",
  wrench: "M14.5 6.5a4 4 0 0 0 5 5L13 18a2.1 2.1 0 0 1-3-3l6.5-6.5a4 4 0 0 1-2-2ZM6 18l-2 2",
  cash: "M3 7h18v10H3V7Zm9 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 10v4m12-4v4",
  bank: "M3 10h18L12 4 3 10Zm2 0v7m4.5-7v7m5-7v7M19 10v7M3 20h18",
  key: "M14 10a4 4 0 1 0-3.5 3.97L9 15.5V18H6.5v2.5H4V17l6-6a4 4 0 0 0 4-1Zm2-2h.01",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  heart: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z",
  share: "M12 4v11m0-11-4 4m4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5",
  camera: "M4 8h3l1.5-2.5h7L17 8h3v11H4V8Zm8 8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  copy: "M9 9h10v11H9V9Zm-4 6V4h10",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5m11-5v5h-5",
  engine: "M4 10h2V8h3V6h6v2h2l2 3h1v5h-1l-2 3H8l-2-2H4v-7Zm5-4h4",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 3h-5l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2l.4 2.6h5l.4-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  drive: "M5 6h4M5 18h4M15 6h4M15 18h4M7 6v12M17 6v12M7 12h10",
  fuel: "M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M4 20h11M14 9h2l2 2v6a1.5 1.5 0 0 0 3 0V9l-3-3M8 8h3",
  calendar: "M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4",
  palette: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.7 1.5-1.5 0-1.2-1-1.5-1-2.5s.8-1.5 2-1.5H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5Zm-4.5 9h.01M9 7.5h.01M15 7.5h.01",
  shield: "M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
  flame: "M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-1 2-2 3-3.5 3.5C9 7 8 5.5 8 4c-1.5 2-2 4-2 6a7 7 0 0 0 .2 1.5A6 6 0 0 0 12 21Z",
  road: "M8 3 4 21M16 3l4 18M12 4v2m0 3v2m0 3v2m0 3v2",
  bolt: "M13 3 5 13h6l-1 8 8-10h-6l1-8Z",
  door: "M6 3h10l3 3v15H6V3Zm9 9h.01",
  step: "M4 17h16M6 17v-3h12v3M8 14V9h8v5",
  hitch: "M4 12h9m0 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM4 9v6",
  mountain: "M3 19 9.5 8l4 6.5L16 11l5 8H3Z",
  seat: "M7 4h5l1 9h5a1 1 0 0 1 1 1v3H8L7 4Zm1 13v3m10-3v3",
  radio: "M4 9h16v10H4V9Zm3-4 10 4M8 14h.01M16 14a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-13v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4",
  wheel: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-6V3m0 18v-6m3-3h6M3 12h6",
  box: "M4 7 12 3l8 4v10l-8 4-8-4V7Zm0 0 8 4 8-4m-8 4v10",
  truck: "M3 16V9h9v7M12 11h4l3 3v2h-7M6.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  tag: "M3 12V4h8l10 10-8 8L3 12Zm5-4h.01",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9h.01",
} as const;

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.9,
  filled = false,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
