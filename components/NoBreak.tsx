import { Fragment } from "react";

/** Renders text so hyphenated words ("F-250", "Low-rust") never split across lines. */
export default function NoBreak({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          {w.includes("-") ? <span className="whitespace-nowrap">{w}</span> : w}
        </Fragment>
      ))}
    </>
  );
}
