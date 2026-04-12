import "./CardSurface.css";

export interface ICardSurfaceProps {
  className?: string;
  bgSrc: string;
  holoMaskSrc: string;
}

/**
 * Card surface — yellow outer border + inner base + background image +
 * blend-mode overlay + holographic shimmer + inner shadow. Renders as a
 * fragment: border and surface position independently on the card artboard.
 */
export function CardSurface({ className, bgSrc, holoMaskSrc }: ICardSurfaceProps) {
  return (
    <>
      <div className="card__border" data-name="Border" />
      <div className={className ? `card__surface ${className}` : "card__surface"} data-name="Surface">
        <div aria-hidden="true" className="card__surfaceBase" />
        <div className="card__surfaceBg" data-name="BG">
          <img alt="" className="card__surfaceBgImg" src={bgSrc} />
        </div>
        <div className="card__surfaceOverlay" data-name="Overlay" />
        <div className="card__surfaceHolo" data-name="Holo">
          <div
            className="card__surfaceHoloLayer"
            style={{ maskImage: `url('${holoMaskSrc}')` }}
          />
        </div>
        <div className="card__surfaceInsetShadow" />
      </div>
    </>
  );
}
