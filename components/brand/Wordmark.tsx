import { useId } from "react";
import { wordmarkInner, wordmarkViewBox } from "./brandSvg";

type Props = {
  /** Prismatic edge + light sweep. CSS-driven; reduced-motion users get a still frame. */
  animated?: boolean;
  className?: string;
  title?: string;
};

/** GREENFIELD (red chrome, prismatic edge) over a red rule and AUTO SALES (chrome). */
export default function Wordmark({ animated = true, className, title }: Props) {
  const uid = `gw${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      viewBox={wordmarkViewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      overflow="visible"
      dangerouslySetInnerHTML={{ __html: wordmarkInner(uid, { animated }) }}
    />
  );
}
