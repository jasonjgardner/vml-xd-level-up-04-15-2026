export interface IStageLetterProps {
  x: string;
  y: string;
  width: number;
  height: number;
  path: string;
  viewBox: string;
  insetClass: string;
}

/**
 * Single metallic letter rendered inside the {@link StagePill}.
 *
 * Each letter is absolutely positioned via `x`/`y` (`calc()` expressions)
 * and centred with `translate(-50%, -50%)`. The inner wrapper applies the
 * `insetClass` so the SVG viewBox overflows its box cleanly.
 *
 * @internal Exported for sibling `StagePill` only — not part of the public
 *           card primitive surface.
 */
export function StageLetter({ x, y, width, height, path, viewBox, insetClass }: IStageLetterProps) {
  return (
    <div
      className="card__stageLetter"
      style={{
        blockSize: `${height}px`,
        inlineSize: `${width}px`,
        insetBlockStart: y,
        insetInlineStart: x,
        position: "absolute",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className={`absolute ${insetClass}`}>
        <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox={viewBox}>
          <path d={path} fill="#545454" stroke="white" />
        </svg>
      </div>
    </div>
  );
}
