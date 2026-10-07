import { useId } from "react";
import { badgeInner, badgeViewBox } from "./brandSvg";

type Props = {
  /** Crossed flags behind the hex. Turn off below ~28px (favicon-size). */
  flags?: boolean;
  /** Chrome light sweep across the G. */
  glint?: boolean;
  className?: string;
  /** Accessible name. Omit when a visible/sr-only label sits next to it. */
  title?: string;
};

/**
 * The speed badge: red hex frame, chrome G, a race track running off to the
 * horizon between two crossed checkered flags. Inline SVG, server-rendered.
 */
export default function Badge({ flags = true, glint = false, className, title }: Props) {
  const uid = `gb${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      viewBox={badgeViewBox(flags)}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      overflow="visible"
      dangerouslySetInnerHTML={{ __html: badgeInner(uid, { flags, glint }) }}
    />
  );
}
